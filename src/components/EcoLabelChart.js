import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.primary};
  overflow: auto;
  position: relative;
`;

const ScrollableContent = styled.div`
  padding: 2rem;
  min-width: fit-content;
`;

const ChartTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const LevelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
`;

const LevelSection = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.height}px;
  margin-bottom: 2rem;
`;

const CompletionCircle = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => props.theme.secondary};
  border: 4px solid ${props => props.color || '#3498db'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const LevelName = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const Percentage = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.color || '#3498db'};
`;

const ItemBox = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 280px;
  height: ${props => props.height}px;
  padding: 1rem;
  background: ${props => props.theme.secondary};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 5;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const ConditionBox = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 350px;
  height: ${props => props.height}px;
  padding: 1rem;
  background: ${props => {
    if (props.status === 'completed') return '#27ae60';
    if (props.status === 'priority') return '#f39c12';
    return '#e74c3c';
  }};
  border-radius: 6px;
  color: white;
  font-size: 0.85rem;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 5;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;

const SvgContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  overflow: visible;
`;

const Legend = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  gap: 2rem;
  padding: 1rem 1.5rem;
  background: ${props => props.theme.secondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 100;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  opacity: ${props => props.isActive ? 1 : 0.4};
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    opacity: ${props => props.isActive ? 0.8 : 0.6};
  }
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.color};
  position: relative;

  ${props => !props.isActive && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: -2px;
      right: -2px;
      height: 2px;
      background: white;
      transform: translateY(-50%) rotate(-45deg);
    }
  `}
`;

function EcoLabelChart({ isVisible = false }) {
  const [visibleStatuses, setVisibleStatuses] = useState({
    completed: true,
    priority: true,
    incomplete: true
  });

  const toggleStatus = (status) => {
    setVisibleStatuses(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // 如果尚未可見，顯示載入中
  if (!isVisible) {
    return (
      <ChartContainer>
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
      </ChartContainer>
    );
  }

  const bronzeData = {
    level: '銅級完成率',
    percentage: '53%',
    color: '#CD7F32',
    items: [
      {
        name: '能源與水資源管理',
        conditions: [
          { text: '具有能源、水資源使用之年度統計資料，並自主管理。', status: 'completed' },
          { text: '具有員工環境保護教育訓練計畫及執行實績。', status: 'completed' },
          { text: '設有餐廳者，餐廳不使用保育類食材。', status: 'completed' }
        ]
      },
      {
        name: '員工教育與環保文化',
        conditions: [
          { text: '每年進行空調（暖氣與冷氣）及通風、排氣系統之保養與調整。', status: 'completed' },
          { text: '室內無人區域設置自動調光控制或紅外線控制照明自動點燈等照明設備或確保室內無人區域維持燈具關閉之措施。', status: 'incomplete' }
        ]
      },
      {
        name: '節能照明與節水宣導',
        conditions: [
          { text: '每半年進行用水設備（含管線、蓄水池及冷卻水塔等）之保養與調整。', status: 'priority' },
          { text: '客房採用告示卡或其他方式說明，讓房客能夠選擇每日或多日更換一次床單與毛巾。', status: 'priority' },
          { text: '在浴廁或客房適當位置張貼（或擺放）節約水電宣導卡片。', status: 'priority' }
        ]
      },
      {
        name: '綠色採購與產品使用',
        conditions: [
          { text: '業者應建立綠色採購機制。', status: 'completed' },
          { text: '每年至少有3項綠色產品採購', status: 'incomplete' }
        ]
      },
      {
        name: '減塑行動與一次性用品管理',
        conditions: [
          { text: '場所內不提供免洗餐具，包含塑膠及紙製材質之杯、碗、盤、碟、叉、匙及免洗筷等一次用餐具。', status: 'completed' },
          { text: '具有相關措施向房客說明一次用產品對環境之衝擊。', status: 'priority' }
        ]
      },
      {
        name: '廢棄物與污染防治',
        conditions: [
          { text: '廢棄電池及照明光源具有相關設施或程序之回收機制。', status: 'completed' },
          { text: '環境衛生用藥及病媒防治等符合環保法規規定。', status: 'completed' },
          { text: '具有廢棄物分類及資源回收機制。', status: 'priority' }
        ]
      }
    ]
  };


  const renderLevelSection = (data, levelKey) => {
    // 佈局常數
    const circleX = 0;
    const circleWidth = 150;
    const circleHeight = 150;
    const itemStartX = 200; // 圓圈右邊 + 間距
    const itemBoxWidth = 280;
    const conditionStartX = 530; // 項目框右邊 + 間距
    const itemGap = 50; // 項目之間的間距
    const conditionGap = 20; // 條件之間的間距

    // 根據文字長度估算盒子高度的函數
    const estimateBoxHeight = (text, boxWidth, fontSize = 0.9, padding = 32) => {
      // 中文字符寬度約為 fontSize * 16px
      const charWidth = fontSize * 16;
      const effectiveWidth = boxWidth - padding;
      const charsPerLine = Math.floor(effectiveWidth / charWidth);
      const lines = Math.ceil(text.length / charsPerLine);
      const lineHeight = fontSize * 16 * 1.5; // font-size * base * line-height
      const contentHeight = lines * lineHeight;
      // 加上額外的安全邊距
      return Math.max(contentHeight + padding, 60); // 最小高度60px
    };

    // 計算每個項目組的高度和總高度
    let totalHeight = 0;
    let itemsInfo = [];

    data.items.forEach((item, idx) => {
      // 計算項目框高度
      const itemBoxHeight = estimateBoxHeight(item.name, itemBoxWidth, 0.9, 32);

      // 計算所有條件框的總高度
      let conditionsHeight = 0;
      const conditionHeights = item.conditions.map(cond => {
        return estimateBoxHeight(cond.text, 350, 0.85, 32);
      });

      conditionsHeight = conditionHeights.reduce((sum, h) => sum + h, 0) +
                        (conditionHeights.length - 1) * conditionGap;

      const itemGroupHeight = Math.max(itemBoxHeight, conditionsHeight);
      const itemY = totalHeight;

      itemsInfo.push({
        itemY: itemY,
        itemGroupHeight: itemGroupHeight,
        itemBoxHeight: itemBoxHeight,
        conditionHeights: conditionHeights,
        conditions: item.conditions
      });

      totalHeight += itemGroupHeight;
      if (idx < data.items.length - 1) {
        totalHeight += itemGap;
      }
    });

    // 圓圈垂直居中
    const circleY = (totalHeight - circleHeight) / 2;

    // 生成 SVG 路徑和元素
    let paths = [];
    let elements = [];
    let currentY = 0;

    data.items.forEach((item, idx) => {
      const info = itemsInfo[idx];
      const itemGroupStartY = info.itemY;
      const itemGroupHeight = info.itemGroupHeight;
      const itemBoxHeight = info.itemBoxHeight;

      // 項目框在項目組內垂直居中
      const itemY = itemGroupStartY + (itemGroupHeight - itemBoxHeight) / 2;
      const itemCenterY = itemY + itemBoxHeight / 2;

      // 放置項目框
      elements.push(
        <ItemBox
          key={`item-${levelKey}-${idx}`}
          x={itemStartX}
          y={itemY}
          height={itemBoxHeight}
        >
          {item.name}
        </ItemBox>
      );

      // 從圓圈右邊中點到項目框左邊中點的連接線
      const circleRightX = circleX + circleWidth;
      const circleCenterY = circleY + circleHeight / 2;
      const itemLeftX = itemStartX;

      paths.push(
        <path
          key={`circle-to-item-${levelKey}-${idx}`}
          d={`M ${circleRightX} ${circleCenterY} L ${itemLeftX} ${itemCenterY}`}
          stroke="#8b92a0"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      );

      // 條件框以項目框中心為基準點排列
      const conditionHeights = info.conditionHeights;
      const numConditions = conditionHeights.length;
      let conditionYPositions = new Array(numConditions);

      if (numConditions % 2 === 1) {
        // 奇數：讓中間的條件框對齊項目框中心
        const middleIdx = Math.floor(numConditions / 2);
        conditionYPositions[middleIdx] = itemCenterY - conditionHeights[middleIdx] / 2;

        // 從中間向上排列
        for (let i = middleIdx - 1; i >= 0; i--) {
          conditionYPositions[i] = conditionYPositions[i + 1] - conditionHeights[i] - conditionGap;
        }

        // 從中間向下排列
        for (let i = middleIdx + 1; i < numConditions; i++) {
          conditionYPositions[i] = conditionYPositions[i - 1] + conditionHeights[i - 1] + conditionGap;
        }
      } else {
        // 偶數：讓條件框組的中心對齊項目框中心
        const totalConditionsHeight = conditionHeights.reduce((sum, h) => sum + h, 0) +
                                     (numConditions - 1) * conditionGap;
        let currentY = itemCenterY - totalConditionsHeight / 2;

        for (let i = 0; i < numConditions; i++) {
          conditionYPositions[i] = currentY;
          currentY += conditionHeights[i] + conditionGap;
        }
      }

      item.conditions.forEach((condition, condIdx) => {
        // 检查该状态是否可见
        const isVisible = visibleStatuses[condition.status];
        if (!isVisible) return;

        const conditionHeight = conditionHeights[condIdx];
        const conditionY = conditionYPositions[condIdx];
        const conditionCenterY = conditionY + conditionHeight / 2;

        // 放置條件框
        elements.push(
          <ConditionBox
            key={`condition-${levelKey}-${idx}-${condIdx}`}
            x={conditionStartX}
            y={conditionY}
            height={conditionHeight}
            status={condition.status}
          >
            {condition.text}
          </ConditionBox>
        );

        // 從項目框右邊中點到條件框左邊中點的連接線
        const itemRightX = itemStartX + itemBoxWidth;
        const conditionLeftX = conditionStartX;

        paths.push(
          <path
            key={`item-to-condition-${levelKey}-${idx}-${condIdx}`}
            d={`M ${itemRightX} ${itemCenterY} L ${conditionLeftX} ${conditionCenterY}`}
            stroke="#8b92a0"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
        );
      });
    });

    return (
      <LevelSection key={levelKey} height={totalHeight + 50}>
        <SvgContainer>
          {paths}
        </SvgContainer>

        <CompletionCircle
          x={circleX}
          y={circleY}
          color={data.color}
        >
          <LevelName>{data.level}</LevelName>
          <Percentage color={data.color}>{data.percentage}</Percentage>
        </CompletionCircle>

        {elements}
      </LevelSection>
    );
  };

  return (
    <ChartContainer>
      <ScrollableContent>
        <ChartTitle>環保標章取得樹狀圖</ChartTitle>

        <LevelsContainer>
          {renderLevelSection(bronzeData, 'bronze')}
        </LevelsContainer>

        <Legend>
          <LegendItem
            isActive={visibleStatuses.completed}
            onClick={() => toggleStatus('completed')}
          >
            <LegendColor color="#27ae60" isActive={visibleStatuses.completed} />
            <span>已完成項目</span>
          </LegendItem>
          <LegendItem
            isActive={visibleStatuses.priority}
            onClick={() => toggleStatus('priority')}
          >
            <LegendColor color="#f39c12" isActive={visibleStatuses.priority} />
            <span>建議優先進行項目</span>
          </LegendItem>
          <LegendItem
            isActive={visibleStatuses.incomplete}
            onClick={() => toggleStatus('incomplete')}
          >
            <LegendColor color="#e74c3c" isActive={visibleStatuses.incomplete} />
            <span>尚未完成項目</span>
          </LegendItem>
        </Legend>
      </ScrollableContent>
    </ChartContainer>
  );
}

export default EcoLabelChart;
