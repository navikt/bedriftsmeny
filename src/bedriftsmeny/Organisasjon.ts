export interface Organisasjon {
    Name: string;
    Type: string;
    OrganizationNumber: string;
    OrganizationForm: string;
    Status: string;
    ParentOrganizationNumber: string;
}

export interface JuridiskEnhetMedUnderEnheterArray {
    JuridiskEnhet: Organisasjon;
    Underenheter: Array<Organisasjon>;
}

export const tomAltinnOrganisasjon: Organisasjon = {
    Name: '',
    Type: '',
    OrganizationNumber: '',
    OrganizationForm: '',
    Status: '',
    ParentOrganizationNumber: ''
};

export interface OrganisasjonFraEnhetsregisteret {
    organisasjonsnummer: string;
    navn: string;
    organisasjonsform: {
        kode: string;
        beskrivelse: string;
    };
    naeringskode1: {
        kode: string;
        beskrivelse: string;
    }
    naeringskode2: {
        kode: string;
        beskrivelse: string;
    }
    naeringskode3: {
        kode: string;
        beskrivelse: string;
    }
    postadresse: {
        adresse: Array<string>;
        postnummer: string;
        poststed: string;
        kommunenummer: string;
        kommune: string;
        landkode: string;
        land: string;
    };
    forretningsadresse: {
        adresse: Array<string>;
        postnummer: string;
        poststed: string;
        kommunenummer: string;
        kommune: string;
        landkode: string;
        land: string;
    }
    hjemmeside: string;
    overordnetEnhet: string;
}

export const tomEnhetsregOrg: OrganisasjonFraEnhetsregisteret = {
    organisasjonsnummer: '',
    navn: '',
    organisasjonsform: {
        kode: '',
        beskrivelse: ''
    },
    overordnetEnhet: '',
    hjemmeside: '',
    postadresse: {
        land: '',
        landkode: '',
        postnummer: '',
        poststed: '',
        adresse: [''],
        kommune: '',
        kommunenummer: ''
    },
    forretningsadresse: {
        land: '',
        landkode: '',
        postnummer: '',
        poststed: '',
        adresse: [''],
        kommune: '',
        kommunenummer: ''
    },
    naeringskode1: {
        beskrivelse: '',
        kode: ''
    },
    naeringskode2: {
        beskrivelse: '',
        kode: ''
    },
    naeringskode3: {
        beskrivelse: '',
        kode: ''
    }
};


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
