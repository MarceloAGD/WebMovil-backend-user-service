import { Entity, Column, PrimaryGeneratedColumn , Unique} from 'typeorm';
import { ObjectType, Field, Int, Directive} from '@nestjs/graphql';


@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;
    
    @Column()
    @Unique(["email"]) // Indica que el campo debe ser único en la columna "email"
    @Field()
    email: string;
    
    @Column()
    @Field()
    name: string;
    
    @Column()
    @Field()
    password: string;

}
    