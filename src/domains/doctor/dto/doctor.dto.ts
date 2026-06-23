export interface CreateDoctorRequestDto {
  name: string;
  specialization: string;
  experience: number;
}

export interface DoctorResponseDto {
  id: number;
  publicId: string;
  name: string;
  specialization: string;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDoctorResponseDto {
  id: number;
  publicId: string;
  name: string;
  specialization: string;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}
