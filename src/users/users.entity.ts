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

    @Column('int', {array:true, default:[]})
    idTeams: number[];
}

export class Response {
    response: boolean;
  }

  export class DeleteUserResponse {
    
    success: boolean;
  
    
    message: string;
  }  

  export class addTeamToUserResponse {
    
    success: boolean;
  
    
    message: string;
  }  

  export class validateUserResponse {
    
    success: boolean;
  
    message: string;

    idUser?: number;
  }  


    