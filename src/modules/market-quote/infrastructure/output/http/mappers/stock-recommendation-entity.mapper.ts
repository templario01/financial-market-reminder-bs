import { plainToInstance } from 'class-transformer';
import { StockRecommendationEntity } from '../../../../domain/entities/stock-recommendation.entity';
import { StockRecommendationResponseDto } from '../dtos/stock-recommendation.response.dto';

export class StockRecommendationEntityMapper {
  static toEntity(
    dto: StockRecommendationResponseDto,
  ): StockRecommendationEntity {
    return plainToInstance(StockRecommendationEntity, {
      symbol: dto.symbol,
      period: dto.period,
      buy: dto.buy,
      hold: dto.hold,
      sell: dto.sell,
      strongBuy: dto.strongBuy,
      strongSell: dto.strongSell,
    } as StockRecommendationEntity);
  }
}
