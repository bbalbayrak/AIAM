import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Prices } from '../prices/prices.entity';

@Table
export class Products extends Model<Products> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  active: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @HasMany(() => Prices)
  prices: Prices[];
}
