import { Entity, PrimaryGeneratedColumn, Column,  ManyToOne} from 'typeorm';
import RealEstate from './realEstates.entity';
import User from './user.entity';

@Entity("schedules")
class Schedule {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'date'})
    date: string;

    @Column({type: 'time'})
    hour: string;

    @ManyToOne(() => User, (user) => user.schedules, { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => RealEstate, (realEstate) => realEstate.schedules)
    realEstate: RealEstate;

}   

export default Schedule;