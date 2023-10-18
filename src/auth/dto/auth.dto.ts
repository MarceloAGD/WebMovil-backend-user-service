export class Payload {
    id: number;
    email: string;
  }
  
  export class UserDto {
    id: number;
    name: string;
    email: string;
    password: string;
  }
  
  export class RefreshToken {
    oldToken: string;
  }

  export class Login{
    email: string;
    password: string;
  }