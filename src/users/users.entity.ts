import { Entity, Column, PrimaryGeneratedColumn , Unique} from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    @Unique(["email"]) // Indica que el campo debe ser único en la columna "email"
    email: string;
    
    @Column()
    password: string;

    @Column()
    role?: string;
}


 


    