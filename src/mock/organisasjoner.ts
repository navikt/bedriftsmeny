import {JuridiskEnhetMedUnderEnheterArray, Organisasjon} from '../bedriftsmeny/Organisasjon';

/*const MOCK_ORGANISASJONSTRE: JuridiskEnhetMedUnderEnheterArray[] = [
    {
        JuridiskEnhet: {
            Name: 'BALLSTAD OG HORTEN',
            Type: 'Enterprise',
            OrganizationNumber: '811076112',
            ParentOrganizationNumber: '',
            OrganizationForm: 'AS',
            Status: 'Active'
        },
        Underenheter: [
            {
                Name: 'BALLSTAD OG HAMARØY',
                Type: 'Business',
                OrganizationNumber: '811076732',
                ParentOrganizationNumber: '811076112',
                OrganizationForm: 'BEDR',
                Status: 'Active'
            }
        ]
    },
    {
        JuridiskEnhet: {
            Name: 'DIGITAL JUNKIES AS ',
            Type: 'Enterprise',
            OrganizationNumber: '822565212',
            ParentOrganizationNumber: '811076112',
            OrganizationForm: 'AS',
            Status: 'Active'
        },
        Underenheter: [
            {
                Name: 'DIGITAL JUNKIES AS ',
                Type: 'Business',
                OrganizationNumber: '922658986',
                ParentOrganizationNumber: '822565212',
                OrganizationForm: 'BEDR',
                Status: 'Active'
            }
        ]
    },
    {
        JuridiskEnhet: {
            Name: 'NAV INNLANDET',
            Type: '',
            OrganizationNumber: '874652202',
            OrganizationForm: '',
            Status: '',
            ParentOrganizationNumber: ''
        },
        Underenheter: [
            {
                Name: 'NAV ENGERDAL',
                Type: 'Business',
                ParentOrganizationNumber: '874652202',
                OrganizationNumber: '991378642',
                OrganizationForm: 'BEDR',
                Status: 'Active'
            },
            {
                Name: 'NAV HAMAR',
                Type: 'Business',
                ParentOrganizationNumber: '874652202',
                OrganizationNumber: '990229023',
                OrganizationForm: 'BEDR',
                Status: 'Active'
            }
        ]
    }
];
*/


export const MOCK_ORGANISASJONER2: Organisasjon[] = [
    {
        Name: 'BALLSTAD OG EIDSLANDET',
        Type: 'Business',
        OrganizationNumber: '811076422',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'BALLSTAD OG HAMARØY',
        Type: 'Business',
        OrganizationNumber: '811076732',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'BALLSTAD OG HORTEN',
        Type: 'Enterprise',
        OrganizationNumber: '811076112',
        ParentOrganizationNumber: '',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'BALLSTAD OG SÆTERVIK',
        Type: 'Business',
        OrganizationNumber: '811076902',
        ParentOrganizationNumber: '811076112',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'BAREKSTAD OG YTTERVÅG REGNSKAP',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '810514442',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'BIRI OG VANNAREID REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910998250',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'EIDSNES OG AUSTRE ÅMØY',
        Type: 'Business',
        OrganizationNumber: '910521551',
        ParentOrganizationNumber: '910998250',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'FRØNNINGEN OG LAUVSTAD REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910223208',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'HARSTAD OG TYSSEDAL REVISJON',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '810989572',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'HAVNNES OG ÅGSKARDET',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910646176',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'KJØLLEFJORD OG ØKSFJORD',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910175777',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'KYSTBASEN ÅGOTNES OG ILSENG REGNSKAP',
        Type: 'Enterprise',
        OrganizationNumber: '910514318',
        ParentOrganizationNumber: '910175777',
        OrganizationForm: 'ASA',
        Status: 'Active'
    },
    {
        Name: 'RAMNES OG TYSSEDAL REGNSKAP',
        Type: 'Business',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910804456',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'SANDVÆR OG HOV',
        Type: 'Business',
        OrganizationNumber: '910793829',
        OrganizationForm: 'BEDR',
        ParentOrganizationNumber: '910720120',
        Status: 'Active'
    },
    {
        Name: 'SKOTSELV OG HJELSET',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910720120',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'STOL PÅ TORE',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '810771852',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'SØR-HIDLE OG STRAUMGJERDE',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910167200',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'TROMVIK OG SPARBU REVISJON',
        Type: 'Business',
        OrganizationNumber: '910989626',
        ParentOrganizationNumber: '910167200',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'Tore sitt testselskap',
        Type: 'Enterprise',
        ParentOrganizationNumber: '',
        OrganizationNumber: '910820834',
        OrganizationForm: 'AS',
        Status: 'Active'
    },
    {
        Name: 'UGGDAL OG STEINSDALEN',
        Type: 'Business',
        OrganizationNumber: '910521616',
        ParentOrganizationNumber: '910820834',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'VALESTRANDSFOSSEN OG SØRLI REVISJON',
        Type: 'Business',
        OrganizationNumber: '810989602',
        ParentOrganizationNumber: '910820834',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    },
    {
        Name: 'VESTBY OG LOEN REVISJON',
        Type: 'Business',
        OrganizationNumber: '910989642',
        ParentOrganizationNumber: '910820834',
        OrganizationForm: 'BEDR',
        Status: 'Active'
    }
    ]
;
