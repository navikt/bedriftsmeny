export interface Organisasjon {
    Name: string;
    OrganizationNumber: string;
    OrganizationForm: string;
    ParentOrganizationNumber: string;
}

export interface JuridiskEnhetMedUnderEnheterArray {
    JuridiskEnhet: Organisasjon;
    Underenheter: Array<Organisasjon>;
    SokeresultatKunUnderenhet?: boolean;
}

export interface OrganisasjonFraEnhetsregisteret {
    organisasjonsnummer: string;
    navn: string;
    organisasjonsform: {
        kode: string;
        beskrivelse: string;
    };
    overordnetEnhet: string;
}

export interface ListeMedJuridiskeEnheter {
    _embedded: {
        enheter: OrganisasjonFraEnhetsregisteret[];
    };
    _links: {
        self: {
            href: string;
        };
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: 0;
    };
}
