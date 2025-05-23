import { useCallback } from "react";
import { Organisasjon } from "../../../bedriftsmeny/Bedriftsmeny"

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Heading } from "@navikt/ds-react";
import { OrgnrSearchParamType } from "../../../bedriftsmeny/velger/utils";

interface Props {
    organisasjoner: Organisasjon[];
}

const Bedriftsmeny = dynamic(() => import("../../../bedriftsmeny/Bedriftsmeny"), {
    ssr: false,
});

export const useHentOrgnummer = () => {
    const { push, query } = useRouter();
    const retriever = useCallback<OrgnrSearchParamType>(() => {
        const currentOrgnr =
            typeof query.bedrift === "string" ? query.bedrift : null;

        return [
            currentOrgnr,
            (orgnr: string) => {
                if (currentOrgnr !== orgnr) {
                    if (orgnr === null) {
                        push("");
                    } else {
                        push(`?bedrift=${orgnr}`);
                    }
                }
            },
        ];
    }, [push, query.bedrift]);
    return {
        hook: retriever,
        orgnr: retriever()[0],
    };
};

export default function Banner({ organisasjoner }: Props) {
    return (
        <Bedriftsmeny
            orgnrSearchParam={useHentOrgnummer().hook}
            sidetittel={
                <Heading size="xlarge" level="1">
                    Forebygge fravær
                </Heading>
            }
            organisasjoner={organisasjoner}
        />
    );
}