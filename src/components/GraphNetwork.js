import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: ${props => props.theme.primary};
  overflow: hidden;
`;

const MapSvg = styled.svg`
  width: 100%;
  height: 100%;
  cursor: default;

  g {
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
`;

const InfoPanel = styled.div`
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  background: ${props => props.theme.secondary};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 2rem;
  z-index: 100;
  min-width: 250px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const InfoTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const InfoContent = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const InfoItem = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: ${props => props.theme.primary};
  border-radius: 6px;

  strong {
    color: ${props => props.theme.text};
    display: block;
    margin-bottom: 0.25rem;
  }
`;

const LegendPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  z-index: 100;
  min-width: 180px;
`;

const LegendTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
  font-size: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: ${props => props.color};
`;

const CountyTooltip = styled.div`
  position: absolute;
  background: ${props => props.theme.secondary};
  border: 2px solid ${props => props.theme.border};
  border-radius: 10px;
  padding: 1rem;
  pointer-events: none;
  z-index: 500;
  color: ${props => props.theme.text};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s ease;
  min-width: 220px;
`;

const TooltipTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const TooltipStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const TooltipLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: ${props => props.color};
  }
`;

const TooltipValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const TooltipTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${props => props.theme.border};
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

// 县市数据（使用臺字以匹配 GeoJSON）
const countyData = {
  "台北市": { hotels: 28, gold: 10, silver: 12, bronze: 6, region: "north" },
  "桃園市": { hotels: 22, gold: 1, silver: 9, bronze: 12, region: "north" },
  "高雄市": { hotels: 18, gold: 5, silver: 6, bronze: 7, region: "south" },
  "台東縣": { hotels: 17, gold: 1, silver: 1, bronze: 15, region: "east" },
  "台南市": { hotels: 15, gold: 0, silver: 6, bronze: 9, region: "south" },
  "花蓮縣": { hotels: 12, gold: 2, silver: 4, bronze: 6, region: "east" },
  "宜蘭縣": { hotels: 10, gold: 3, silver: 3, bronze: 4, region: "east" },
  "新北市": { hotels: 10, gold: 8, silver: 2, bronze: 0, region: "north" },
  "屏東縣": { hotels: 9, gold: 1, silver: 3, bronze: 5, region: "south" },
  "台中市": { hotels: 8, gold: 1, silver: 4, bronze: 3, region: "central" },
  "嘉義縣": { hotels: 7, gold: 4, silver: 2, bronze: 1, region: "south" },
  "新竹市": { hotels: 5, gold: 2, silver: 0, bronze: 3, region: "north" },
  "苗栗縣": { hotels: 5, gold: 0, silver: 2, bronze: 3, region: "central" },
  "新竹縣": { hotels: 4, gold: 0, silver: 0, bronze: 4, region: "north" },
  "金門縣": { hotels: 4, gold: 1, silver: 0, bronze: 3, region: "island" },
  "南投縣": { hotels: 3, gold: 1, silver: 2, bronze: 0, region: "central" },
  "嘉義市": { hotels: 3, gold: 2, silver: 0, bronze: 1, region: "south" },
  "彰化縣": { hotels: 3, gold: 0, silver: 1, bronze: 2, region: "central" },
  "澎湖縣": { hotels: 3, gold: 2, silver: 0, bronze: 1, region: "island" },
  "雲林縣": { hotels: 2, gold: 0, silver: 2, bronze: 0, region: "central" },
  "基隆市": { hotels: 1, gold: 0, silver: 1, bronze: 0, region: "north" },
  "連江縣": { hotels: 0, gold: 0, silver: 0, bronze: 0, region: "island" }
};

// 图例项 - 全國總量統計（按總量分級）
const legendItems = [
  { color: '#2ecc71', label: '高度推動 (≥20間)', range: '20+' },
  { color: '#3498db', label: '積極推動 (10-19間)', range: '10-19' },
  { color: '#95a5a6', label: '發展中 (5-9間)', range: '5-9' },
  { color: '#7f8c8d', label: '起步階段 (<5間)', range: '0-4' }
];

function GraphNetwork({ data, isVisible = false }) {
  const svgRef = useRef();
  const selectedPathRef = useRef(null); // 用 ref 追蹤選中的路徑，避免觸發重繪
  const [hoveredCounty, setHoveredCounty] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipUpdateTimerRef = useRef(null);

  // 加载台湾 GeoJSON 数据
  useEffect(() => {
    // 使用公开的台湾县市 GeoJSON 数据
    fetch('https://raw.githubusercontent.com/g0v/twgeojson/master/json/twCounty2010.geo.json')
      .then(response => response.json())
      .then(json => {
        // 合并我们的数据到 GeoJSON
        json.features.forEach(feature => {
          const countyName = feature.properties.COUNTYNAME || feature.properties.name;
          if (countyData[countyName]) {
            feature.properties = {
              ...feature.properties,
              name: countyName,
              hotels: countyData[countyName].hotels,
              gold: countyData[countyName].gold,
              silver: countyData[countyName].silver,
              bronze: countyData[countyName].bronze,
              region: countyData[countyName].region
            };
          }
        });
        setGeoData(json);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        // 如果加载失败，使用备用方案
        console.log('使用备用地图数据');
      });
  }, []);

  // 根据旅宿总量获取颜色
  const getColor = useCallback((hotels) => {
    if (hotels >= 20) return '#2ecc71'; // 高度推動 - 綠色
    if (hotels >= 10) return '#3498db'; // 積極推動 - 藍色
    if (hotels >= 5) return '#95a5a6';  // 發展中 - 淺灰
    return '#7f8c8d'; // 起步階段 - 深灰
  }, []);

  useEffect(() => {
    // 檢查必要條件：geoData 已載入、地圖可見、SVG 元素已渲染
    if (!geoData || !isVisible || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 清除之前的内容
    svg.selectAll("*").remove();

    // 创建投影（根据实际的 GeoJSON bounds 计算）
    const bounds = d3.geoBounds(geoData);
    const centerX = (bounds[0][0] + bounds[1][0]) / 2;
    const centerY = (bounds[0][1] + bounds[1][1]) / 2;

    const projection = d3.geoMercator()
      .center([centerX, centerY])
      .fitSize([width * 0.9, height * 0.9], geoData)
      .translate([width / 2, height / 2]);

    // 簡化路徑以提升性能
    const path = d3.geoPath()
      .projection(projection)
      .pointRadius(1.5); // 減少點的半徑

    // 创建容器组
    const g = svg.append("g");

    // 添加缩放功能（大幅優化性能）
    let isZooming = false;
    const zoom = d3.zoom()
      .scaleExtent([0.8, 3])  // 進一步降低最大缩放倍数
      .on("start", () => {
        isZooming = true;
      })
      .on("zoom", (event) => {
        // 使用 CSS transform 而非 SVG transform，性能更好
        const { x, y, k } = event.transform;
        g.style("transform", `translate(${x}px, ${y}px) scale(${k})`);
        g.style("transform-origin", "0 0");
      })
      .on("end", () => {
        isZooming = false;
      });

    svg.call(zoom);

    // 绘制县市（優化渲染性能）
    const paths = g.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => getColor(d.properties.hotels || 0))
      .attr("stroke", "#263238")
      .attr("stroke-width", 1)
      .attr("vector-effect", "non-scaling-stroke") // 防止 zoom 時 stroke 變粗
      .style("cursor", "pointer")
      .style("shape-rendering", "geometricPrecision") // 優化渲染
      .on("mouseenter", function(event, d) {
        // zoom 期間禁用 hover 效果
        if (isZooming) return;

        // 只有非選中狀態才改變顏色
        if (selectedPathRef.current !== this) {
          d3.select(this)
            .attr("fill", "#e74c3c")
            .attr("stroke-width", 2);
        }

        // 更新 tooltip 位置
        const x = Math.min(event.pageX + 15, window.innerWidth - 260);
        const y = Math.max(event.pageY - 10, 50);
        setTooltipPosition({ x, y });
        setHoveredCounty(d.properties);
      })
      .on("mousemove", function(event, d) {
        // 使用 throttle 減少更新頻率
        if (tooltipUpdateTimerRef.current) return;

        tooltipUpdateTimerRef.current = setTimeout(() => {
          const x = Math.min(event.pageX + 15, window.innerWidth - 260);
          const y = Math.max(event.pageY - 10, 50);
          setTooltipPosition({ x, y });
          tooltipUpdateTimerRef.current = null;
        }, 16); // 約 60fps
      })
      .on("mouseleave", function(event, d) {
        // zoom 期間禁用
        if (isZooming) return;

        // 清除 throttle timer
        if (tooltipUpdateTimerRef.current) {
          clearTimeout(tooltipUpdateTimerRef.current);
          tooltipUpdateTimerRef.current = null;
        }

        // 只有非選中狀態才恢復顏色
        if (selectedPathRef.current !== this) {
          d3.select(this)
            .attr("fill", getColor(d.properties.hotels || 0))
            .attr("stroke-width", 1);
        }
        setHoveredCounty(null);
      })
      .on("click", function(event, d) {
        // 取消之前选中的县市
        if (selectedPathRef.current) {
          const prevData = d3.select(selectedPathRef.current).datum();
          d3.select(selectedPathRef.current)
            .attr("fill", getColor(prevData.properties.hotels || 0))
            .attr("stroke-width", 1);
        }

        // 选中当前县市
        d3.select(this)
          .attr("fill", "#f39c12")
          .attr("stroke-width", 2);

        selectedPathRef.current = this;
        setSelectedCounty(d.properties);
      });

    // Cleanup
    return () => {
      if (tooltipUpdateTimerRef.current) {
        clearTimeout(tooltipUpdateTimerRef.current);
      }
    };

  }, [geoData, getColor, isVisible]); // 添加 isVisible 以在地圖變為可見時渲染

  const displayCounty = hoveredCounty || selectedCounty;

  // 如果 GeoJSON 未載入或地圖尚未可見，顯示載入中
  if (!geoData || !isVisible) {
    return (
      <GraphContainer>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          color: '#b0b8c4',
          fontSize: '1.2rem'
        }}>
          載入中...
        </div>
      </GraphContainer>
    );
  }

  return (
    <GraphContainer>
      <MapSvg ref={svgRef} />

      <CountyTooltip
        show={hoveredCounty !== null}
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`
        }}
      >
        {hoveredCounty && (
          <>
            <TooltipTitle>
              {(hoveredCounty.name || hoveredCounty.COUNTYNAME || '').replace("臺", "台")}
            </TooltipTitle>
            <TooltipStats>
              <TooltipRow>
                <TooltipLabel color="#FFD700">金級標章</TooltipLabel>
                <TooltipValue>{hoveredCounty.gold || 0} 間</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel color="#C0C0C0">銀級標章</TooltipLabel>
                <TooltipValue>{hoveredCounty.silver || 0} 間</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel color="#CD7F32">銅級標章</TooltipLabel>
                <TooltipValue>{hoveredCounty.bronze || 0} 間</TooltipValue>
              </TooltipRow>
            </TooltipStats>
            <TooltipTotal>
              <span>總計</span>
              <span>{hoveredCounty.hotels || 0} 間</span>
            </TooltipTotal>
          </>
        )}
      </CountyTooltip>

      <InfoPanel show={displayCounty !== null}>
        {displayCounty && displayCounty.hotels !== undefined && (
          <>
            <InfoTitle>{(displayCounty.name || displayCounty.COUNTYNAME || '').replace("臺", "台")}</InfoTitle>
            <InfoContent>
              <InfoItem>
                <strong>金級標章</strong>
                {displayCounty.gold || 0} 間
              </InfoItem>
              <InfoItem>
                <strong>銀級標章</strong>
                {displayCounty.silver || 0} 間
              </InfoItem>
              <InfoItem>
                <strong>銅級標章</strong>
                {displayCounty.bronze || 0} 間
              </InfoItem>
              <InfoItem style={{ background: 'rgba(52, 152, 219, 0.1)', fontWeight: 'bold' }}>
                <strong>總計</strong>
                {displayCounty.hotels || 0} 間
              </InfoItem>
              <InfoItem>
                <strong>區域</strong>
                {displayCounty.region === 'north' ? '北部' :
                 displayCounty.region === 'central' ? '中部' :
                 displayCounty.region === 'south' ? '南部' :
                 displayCounty.region === 'east' ? '東部' : '離島'}
              </InfoItem>
            </InfoContent>
          </>
        )}
      </InfoPanel>

      <LegendPanel>
        <LegendTitle>旅宿分布等級</LegendTitle>
        {legendItems.map((item, index) => (
          <LegendItem key={index}>
            <LegendColor color={item.color} />
            <span>{item.label}</span>
          </LegendItem>
        ))}
        <LegendItem style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #37474f', fontWeight: 'bold', fontSize: '0.95rem' }}>
          <span>全國環保標章總計: 189 間</span>
        </LegendItem>
      </LegendPanel>
    </GraphContainer>
  );
}

export default GraphNetwork;
