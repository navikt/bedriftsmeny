import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './organisasjon';
import { byggOrganisasjonstre } from './byggOrganisasjonsTre';
import { VirksomhetsvelgerProvider } from './velger/VirksomhetsvelgerProvider';
import { BedriftsmenyView } from './BedriftsmenyView';
import { OrgnrSearchParamType } from './velger/utils';
import Velger from './velger/Virksomhetsvelger';

interface EgneProps {
    sidetittel?: string | JSX.Element;
    organisasjoner?: Organisasjon[];
    onOrganisasjonChange?: (organisasjon: Organisasjon) => void;
    /**
     * Hook som styrer hvordan man skal oppdatere søkeparametere i urlen
     */
    orgnrSearchParam?: OrgnrSearchParamType;
    /** @deprecated not in use. field preserved for api stability. */
    amplitudeClient?: any;
    children?: ReactNode;
}

const Bedriftsmeny: FunctionComponent<EgneProps> = (props) => {
    const { sidetittel = 'Arbeidsgiver' } = props;

    return (
        <BedriftsmenyView
            tittel={sidetittel}
            virksomhetsvelger={<Virksomhetsvelger {...props} friKomponent={false} />}
            bjelle={props.children}
        />
    );
};

export type VirksomhetsvelgerProps = {
    organisasjoner?: Organisasjon[];
    onOrganisasjonChange?: (organisasjon: Organisasjon) => void;
    /**
     * Hook som styrer hvordan man skal oppdatere søkeparametere i urlen
     */
    orgnrSearchParam?: OrgnrSearchParamType;
    friKomponent?: boolean;
    maxWidth?: string;
    /** @deprecated not in use. field preserved for api stability. */
    amplitudeClient?: any;
};

export const Virksomhetsvelger = (props: VirksomhetsvelgerProps): ReactElement => {
    const [organisasjonstre, setOrganisasjonstre] = useState<
        JuridiskEnhetMedUnderEnheterArray[] | undefined
    >(undefined);

    useEffect(() => {
        if (props.organisasjoner && props.organisasjoner.length > 0) {
            byggOrganisasjonstre(props.organisasjoner).then((nyttOrganisasjonstre) => {
                if (nyttOrganisasjonstre.length > 0) {
                    setOrganisasjonstre(nyttOrganisasjonstre);
                }
            });
        }
    }, [props.organisasjoner]);

    const visVirksomhetsvelger =
        organisasjonstre &&
        organisasjonstre.length > 0 &&
        props.organisasjoner &&
        props.organisasjoner?.length > 0;

    if (!visVirksomhetsvelger) {
        return <></>;
    }

    return (
        <VirksomhetsvelgerProvider
            orgnrSearchParam={props.orgnrSearchParam}
            organisasjonstre={organisasjonstre ?? []}
            onOrganisasjonChange={props.onOrganisasjonChange ?? (() => {})}
        >
            <Velger friKomponent={props.friKomponent ?? true} maxWidth={props.maxWidth} />
        </VirksomhetsvelgerProvider>
    );
};

type Organisasjonstre = {
    name: string;
    orgNr: string;
    organizationForm: string;
    underenheter: Organisasjonstre[];
};

export const flatUtOrganisasjonstre = (organisasjonstre: Organisasjonstre[]): Organisasjon[] => {
    const kutter = (parent: Organisasjonstre, parentOrgNr: String = ''): Organisasjon[] => {
        return parent.underenheter
            .flatMap((child, i) => {
                if (child.underenheter.length > 0) {
                    return kutter(child, parent.orgNr);
                } else {
                    return [
                        ...[
                            i === 0
                                ? {
                                      Name: parent.name,
                                      OrganizationNumber: parent.orgNr,
                                      OrganizationForm: parent.organizationForm,
                                      ParentOrganizationNumber: parentOrgNr,
                                  }
                                : null,
                        ],
                        {
                            Name: child.name,
                            OrganizationNumber: child.orgNr,
                            OrganizationForm: child.organizationForm,
                            ParentOrganizationNumber: parent.orgNr,
                        },
                    ];
                }
            })
            .filter((x) => x !== null) as Organisasjon[];
    };
    return organisasjonstre.flatMap((o) => kutter(o));
};

type OrganisasjonstreV2 = {
    navn: string;
    orgnr: string;
    organisasjonsform: string;
    underenheter: OrganisasjonstreV2[];
};

export const flatUtOrganisasjonstreV2 = (
    organisasjonstre: OrganisasjonstreV2[]
): Organisasjon[] => {
    const kutter = (parent: OrganisasjonstreV2, parentOrgNr: String = ''): Organisasjon[] => {
        return parent.underenheter
            .flatMap((child, i) => {
                if (child.underenheter.length > 0) {
                    return kutter(child, parent.orgnr);
                } else {
                    return [
                        ...[
                            i === 0
                                ? {
                                      Name: parent.navn,
                                      OrganizationNumber: parent.orgnr,
                                      OrganizationForm: parent.organisasjonsform,
                                      ParentOrganizationNumber: parentOrgNr,
                                  }
                                : null,
                        ],
                        {
                            Name: child.navn,
                            OrganizationNumber: child.orgnr,
                            OrganizationForm: child.organisasjonsform,
                            ParentOrganizationNumber: parent.orgnr,
                        },
                    ];
                }
            })
            .filter((x) => x !== null) as Organisasjon[];
    };
    return organisasjonstre.flatMap((o) => kutter(o));
};

export { hentAlleJuridiskeEnheter } from './hentAlleJuridiskeEnheter';
export type { Organisasjon } from './organisasjon';

export type BedriftsmenyHeaderProps = {
    tittel?: string;
};
export const BedriftsmenyHeader = (props: BedriftsmenyHeaderProps): ReactElement => (
    <BedriftsmenyView tittel={props.tittel} virksomhetsvelger={<></>} />
);

export default Bedriftsmeny;
