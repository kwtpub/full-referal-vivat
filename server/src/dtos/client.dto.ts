export type ClientCreateInput = {
  name: string;
  phone: string;
  agentId: string;
};

export function CreateClientDto(data: ClientCreateInput) {
  return {
    name: data.name,
    phone: data.phone,
    agentId: data.agentId,
  };
}
