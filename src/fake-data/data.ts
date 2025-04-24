import { Doctor } from "../types/User";

export const fakeDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. João Silva",
    email: "joao@andrezitosmedic.com",
    role: "doctor" as const,
    specialty: "Cardiologia",
    image: "https://mighty.tools/mockmind-api/content/human/91.jpg",
  },
  {
    id: "2",
    name: "Dra. Maria Santos",
    email: "maria@andrezitosmedic.com",
    role: "doctor" as const,
    specialty: "Dermatologista",
    image: "https://mighty.tools/mockmind-api/content/human/97.jpg",
  },
  {
    id: "3",
    name: "Dr. Pedro Oliveira",
    email: "pedro@andrezitosmedic.com",
    role: "doctor" as const,
    specialty: "Oftalmologista",
    image: "https://mighty.tools/mockmind-api/content/human/79.jpg",
  },
];