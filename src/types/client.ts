
type ClientStatus = 'active' | 'paused' | 'archived';
type ContactType = 'email' | 'phone';
type ServiceType = 'internet' | 'telephony' | "dataTransfer";
type ServiceStatus = 'active' | 'paused' | "archived";
type serviceTechType = 'wdm' | 'cwdm' | 'ethernet' | 'xdsl' | 'isdn' | 'voip' | 'sip' | 'virtual bpx' | 'physical number';

interface Contact {
  id: number;
  type: ContactType;
  value: string;
  name: string;
}

interface Service {
  id: number;
  serviceType: ServiceType;
  technology: serviceTechType;
  speed?: string;
  fromAddress?: string;
  toAddress?: string;
  phoneNumbers?: string[];
  numberlessLines?: number;
  address?: string;
  status: ServiceStatus;
}

interface Client {
  id: number;
  name: string;
  status: ClientStatus;
  sideNote: string;
  contacts: Contact[];
  services: Service[];
  createdAt: string;
  updatedAt: string;
}

export { Client, Service, Contact };
