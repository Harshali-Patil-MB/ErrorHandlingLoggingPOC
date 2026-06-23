export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  publicId: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface RegisterResponseDto {
  user: UserResponseDto;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
}
