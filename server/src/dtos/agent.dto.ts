type CreateAgentInput = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isAdmin?: boolean;
};

export function createAgentDto(data: CreateAgentInput) {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    isActivated: data.isActive,
    isAdmin: data.isAdmin || false,
  };
}
