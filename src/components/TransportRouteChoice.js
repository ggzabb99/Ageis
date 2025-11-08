import React, { useState } from 'react';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  width: 100%;
  margin-right: auto;
  margin-left: 2rem;
`;

const TitleContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;
`;

const StepBadge = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid ${props => props.theme.text};
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text};
  font-size: 1.8rem;
  font-weight: bold;
`;

const Title = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.8rem;
  text-align: center;
`;

const RoutesContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

const RouteCard = styled.div`
  background: ${props => props.isRecommended ? 'rgba(52, 152, 219, 0.2)' : 'rgba(52, 73, 94, 0.3)'};
  border: ${props => props.isRecommended ? '3px dashed #3498db' : '3px solid #34495e'};
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 320px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const RouteTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const RouteSubtitle = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const RouteTime = styled.div`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const SaveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #27ae60;
  font-size: 1.3rem;
  font-weight: bold;
`;

const LightningIcon = styled.span`
  font-size: 2rem;
`;

// 詳細路線視圖
const DetailedRouteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RouteStepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
`;

const RouteSegment = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 200px;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-width: 700px;
  margin: 0;
  min-height: 40px;
`;

const StepBox = styled.div`
  background: rgba(52, 152, 219, 0.3);
  border: 2px solid #3498db;
  border-radius: 15px;
  padding: 0.6rem 1.5rem;
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 500;
  width: 100%;
  max-width: 220px;
  text-align: center;
  margin: 0 auto;
  grid-column: 2;
`;

const Spacer = styled.div`
  grid-column: 1;
`;

const Distance = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  align-self: center;
`;

const TransportOptions = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-self: center;
`;

const TransportOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  border: ${props => props.isSelected ? '3px solid #27ae60' : props.isRecommended ? '2px dashed #27ae60' : '1px solid #34495e'};
  border-radius: 50%;
  padding: 0.5rem;
  background: ${props => props.isSelected ? 'rgba(39, 174, 96, 0.25)' : props.isRecommended ? 'rgba(39, 174, 96, 0.1)' : 'rgba(52, 73, 94, 0.3)'};
  width: 55px;
  height: 55px;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #27ae60;
  }
`;

const TransportIcon = styled.div`
  font-size: 1.4rem;
`;

const SavePercentage = styled.div`
  color: #27ae60;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-right: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #229954 0%, #1e8449 100%);
  }
`;

const ClearButton = styled(Button)`
  background: rgba(52, 73, 94, 0.5);
  color: ${props => props.theme.text};
  border: 2px solid #34495e;

  &:hover {
    background: rgba(52, 73, 94, 0.7);
    border-color: #5d6d7e;
  }
`;

const SummaryContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(52, 152, 219, 0.1);
  border: 2px solid #3498db;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const SummaryText = styled.div`
  color: ${props => props.theme.text};
  font-size: 1.3rem;
  font-weight: 600;
  flex: 1;
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const QRCodeWrapper = styled.div`
  background: white;
  padding: 0.8rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function TransportRouteChoice({ isVisible, onRouteSelect }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTransports, setSelectedTransports] = useState({
    segment1: 'bus',      // 逢甲 -> 烏日高鐵
    segment2: 'hsr',      // 烏日高鐵 -> 左營高鐵
    segment3: 'mrt'       // 左營高鐵 -> 駁二特區
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isVisible) {
    return (
      <Container>
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
      </Container>
    );
  }

  const handleRouteClick = (routeId) => {
    setSelectedRoute(routeId);
    if (onRouteSelect) {
      onRouteSelect(routeId);
    }
  };

  const handleTransportSelect = (segment, transportType) => {
    setSelectedTransports(prev => ({
      ...prev,
      [segment]: transportType
    }));
  };

  const handleClear = () => {
    setSelectedTransports({
      segment1: 'bus',
      segment2: 'hsr',
      segment3: 'mrt'
    });
    setIsConfirmed(false);
  };

  const handleConfirm = () => {
    // 设置为已确认状态
    setIsConfirmed(true);
    console.log('已选择的交通方式:', selectedTransports);
  };

  // 顯示詳細路線
  if (selectedRoute === 'public-transport') {
    return (
      <Container>
        <ContentWrapper>
          <TitleContainer>
            <StepBadge>3</StepBadge>
            <Title>總公里數約200km，推薦路徑</Title>
          </TitleContainer>

          <DetailedRouteContainer>
            <RouteStepsContainer>
              <RouteSegment>
                <Spacer />
                <StepBox>逢甲</StepBox>
                <div />
              </RouteSegment>

              <RouteSegment>
                <Distance>10km</Distance>
                <div />
                <TransportOptions>
                  {(!isConfirmed || selectedTransports.segment1 === 'bus') && (
                    <TransportOption
                      isSelected={selectedTransports.segment1 === 'bus'}
                      isRecommended={selectedTransports.segment1 !== 'bus'}
                      onClick={() => !isConfirmed && handleTransportSelect('segment1', 'bus')}
                    >
                      <TransportIcon>🚌</TransportIcon>
                      <SavePercentage>⚡60%</SavePercentage>
                    </TransportOption>
                  )}
                  {(!isConfirmed || selectedTransports.segment1 === 'taxi') && (
                    <TransportOption
                      isSelected={selectedTransports.segment1 === 'taxi'}
                      onClick={() => !isConfirmed && handleTransportSelect('segment1', 'taxi')}
                    >
                      <TransportIcon>🚕</TransportIcon>
                    </TransportOption>
                  )}
                  {(!isConfirmed || selectedTransports.segment1 === 'bike') && (
                    <TransportOption
                      isSelected={selectedTransports.segment1 === 'bike'}
                      onClick={() => !isConfirmed && handleTransportSelect('segment1', 'bike')}
                    >
                      <TransportIcon>🚲</TransportIcon>
                      <SavePercentage>⚡95%</SavePercentage>
                    </TransportOption>
                  )}
                </TransportOptions>
              </RouteSegment>

              <RouteSegment>
                <Spacer />
                <StepBox>烏日高鐵</StepBox>
                <div />
              </RouteSegment>

              <RouteSegment>
                <Distance>184km</Distance>
                <div />
                <TransportOptions>
                  {(!isConfirmed || selectedTransports.segment2 === 'hsr') && (
                    <TransportOption
                      isSelected={selectedTransports.segment2 === 'hsr'}
                      isRecommended={selectedTransports.segment2 !== 'hsr'}
                      onClick={() => !isConfirmed && handleTransportSelect('segment2', 'hsr')}
                    >
                      <TransportIcon>🚄</TransportIcon>
                      <SavePercentage>⚡75%</SavePercentage>
                    </TransportOption>
                  )}
                </TransportOptions>
              </RouteSegment>

              <RouteSegment>
                <Spacer />
                <StepBox>左營高鐵</StepBox>
                <div />
              </RouteSegment>

              <RouteSegment>
                <Distance>11km</Distance>
                <div />
                <TransportOptions>
                  {(!isConfirmed || selectedTransports.segment3 === 'mrt') && (
                    <TransportOption
                      isSelected={selectedTransports.segment3 === 'mrt'}
                      isRecommended={selectedTransports.segment3 !== 'mrt'}
                      onClick={() => !isConfirmed && handleTransportSelect('segment3', 'mrt')}
                    >
                      <TransportIcon>🚇</TransportIcon>
                      <SavePercentage>⚡75%</SavePercentage>
                    </TransportOption>
                  )}
                  {(!isConfirmed || selectedTransports.segment3 === 'taxi') && (
                    <TransportOption
                      isSelected={selectedTransports.segment3 === 'taxi'}
                      onClick={() => !isConfirmed && handleTransportSelect('segment3', 'taxi')}
                    >
                      <TransportIcon>🚕</TransportIcon>
                    </TransportOption>
                  )}
                </TransportOptions>
              </RouteSegment>

              <RouteSegment>
                <Spacer />
                <StepBox>駁二特區</StepBox>
                <div />
              </RouteSegment>
            </RouteStepsContainer>

            {!isConfirmed && (
              <ButtonContainer>
                <ClearButton onClick={handleClear}>清除</ClearButton>
                <ConfirmButton onClick={handleConfirm}>確定</ConfirmButton>
              </ButtonContainer>
            )}

            {isConfirmed && (
              <>
                <SummaryContainer>
                  <SummaryText>
                    比起開車共減碳 60~75%，QR Code 內為減碳證明
                  </SummaryText>
                  <QRCodeContainer>
                    <QRCodeWrapper>
                      <QRCodeSVG
                        value="http://localhost:3000/Aegis"
                        size={120}
                        level="H"
                        includeMargin={false}
                      />
                    </QRCodeWrapper>
                  </QRCodeContainer>
                </SummaryContainer>
                <ButtonContainer>
                  <ClearButton onClick={() => setIsConfirmed(false)}>返回編輯</ClearButton>
                </ButtonContainer>
              </>
            )}
          </DetailedRouteContainer>
        </ContentWrapper>
      </Container>
    );
  }

  // 顯示方案選擇
  return (
    <Container>
      <ContentWrapper>
        <Title>總公里數約200km，推薦路徑</Title>

        <RoutesContainer>
          <RouteCard
            isRecommended={true}
            onClick={() => handleRouteClick('public-transport')}
          >
            <RouteTitle>方案一</RouteTitle>
            <RouteSubtitle>
              公共運輸-公車＋高鐵＋捷運
            </RouteSubtitle>
            <RouteTime>時間：2hr 46 min</RouteTime>
            <SaveBadge>
              <LightningIcon>⚡</LightningIcon>
              <span>Save 60%</span>
            </SaveBadge>
          </RouteCard>

          <RouteCard
            isRecommended={false}
            onClick={() => handleRouteClick('car')}
          >
            <RouteTitle>方案二</RouteTitle>
            <RouteSubtitle>
              汽車
            </RouteSubtitle>
            <RouteTime>時間：2hr 38 min</RouteTime>
          </RouteCard>
        </RoutesContainer>
      </ContentWrapper>
    </Container>
  );
}

export default TransportRouteChoice;
