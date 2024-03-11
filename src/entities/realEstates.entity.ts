import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import Address from './address.entity';
import Category from './categories.entity';
import Schedule from './schedules.entity';

@Entity("realEstates")
class RealEstate {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    value: number | string;

    @Column()
    size: number;

    @Column({ default: false })
    sold: boolean;

    @CreateDateColumn({ type: 'date'})
    createdAt: string;

    @UpdateDateColumn({ type: 'date'})
    updatedAt: string;
    
    @OneToMany(() => Schedule, (schedules) => schedules.realEstate)
    schedules: Schedule[];

    @OneToOne(() => Address, (address) => address.realEstate)
    @JoinColumn()
    address: Address;
    
    @ManyToOne(() => Category, (category) => category.realEstate)
    category: Category;
}

export default RealEstate;