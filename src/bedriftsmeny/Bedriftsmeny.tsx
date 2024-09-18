import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from 'react';
import { JuridiskEnhetMedUnderEnheterArray, Organisasjon } from './organisasjon';
import { byggOrganisasjonstre } from './byggOrganisasjonsTre';
import { VirksomhetsvelgerProvider } from './velger/VirksomhetsvelgerProvider';
import { BedriftsmenyView } from './BedriftsmenyView';
import { OrgnrSearchParamType } from './velger/utils';
import Velger from './velger/Virksomhetsvelger';

interface EgneProps {
    sidetittel?: string | JSX.Element;
    undertittel?: string;
    piktogram?: JSX.Element;
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
            undertittel={props.undertittel}
            piktogram={props.piktogram}
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
            <Velger friKomponent={props.friKomponent ?? true} />
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
    const kutter = (organisasjonstre: Organisasjonstre): Organisasjon[] => {
        if (organisasjonstre.underenheter[0]?.underenheter.length > 0) {
            return organisasjonstre.underenheter.flatMap((underenhet) => kutter(underenhet));
        } else {
            return [
                {
                    Name: organisasjonstre.name,
                    OrganizationNumber: organisasjonstre.orgNr,
                    OrganizationForm: organisasjonstre.organizationForm,
                    ParentOrganizationNumber: '',
                },
                ...organisasjonstre.underenheter.map((underenhet) => {
                    return {
                        Name: underenhet.name,
                        OrganizationNumber: underenhet.orgNr,
                        OrganizationForm: underenhet.organizationForm,
                        ParentOrganizationNumber: organisasjonstre.orgNr };
                }),
            ];
        }
    };
    return organisasjonstre.flatMap(o => kutter(o))
};

export { Arbeidsforhold } from './piktogrammer/Arbeidsforhold';
export { AvtalerOmTiltak } from './piktogrammer/AvtalerOmTiltak';
export { ForebyggeSykefravaer } from './piktogrammer/ForebyggeSykefravaer';
export { Kandidater } from './piktogrammer/Kandidater';
export { Refusjon } from './piktogrammer/Refusjon';
export { MSAIkon } from './piktogrammer/MSAIkon';
export { hentAlleJuridiskeEnheter } from './hentAlleJuridiskeEnheter';
export type { Organisasjon } from './organisasjon';

export type BedriftsmenyHeaderProps = {
    tittel?: string;
};
export const BedriftsmenyHeader = (props: BedriftsmenyHeaderProps): ReactElement => (
    <BedriftsmenyView tittel={props.tittel} virksomhetsvelger={<></>} />
);

export default Bedriftsmeny;
