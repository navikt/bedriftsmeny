import React, { useEffect, useState } from 'react';
import { Undertittel, Element, Normaltekst } from 'nav-frontend-typografi';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import JuridiskEnhetIkon from './JuridiskEnhetIkon';
import UnderenhetIkon from './UnderenhetIkon';
import './Organisasjonsbeskrivelse.less';

interface Props {
    navn: string;
    orgnummer: string;
    erJuridiskEnhet?: boolean;
    brukOverskrift?: boolean;
    erApen?: boolean;
}

const Organisasjonsbeskrivelse = ({ navn, orgnummer, erJuridiskEnhet, brukOverskrift, erApen }: Props) => {
    const Navn = brukOverskrift ? Undertittel : Element;
    const Ikon = erJuridiskEnhet ? JuridiskEnhetIkon : UnderenhetIkon;
    const [anker, setAnker] = useState<HTMLElement | undefined>();
    const [skalVisePopover, setSkalVisePopover] = useState(false);
    const [hover, setHover] = useState(false);
    // const max = 30;

    useEffect(() => {
        /* if (navn.length > max) {
            setSkalVisePopover(true);
        } */
        console.log('anker', anker);
        const id = `organisasjonsbeskrivelse${orgnummer}`;
        console.log('id:', id);
        console.log('erApen:', erApen);
        if (erApen === true) {
            const abc = document.getElementById(id) as HTMLElement;
            console.log('anker rect:', abc!!.getBoundingClientRect());
            console.log('abc:', abc);

            // @ts-ignore
            setAnker(abc);
            console.log('anker', anker);
            // console.log('anker on rect:', anker!!.getBoundingClientRect());
        } else setAnker(undefined)

        /* if (anker != undefined) {

            console.log('anker pos', anker.getBoundingClientRect());
            const navn = anker.firstChild as HTMLElement;
            console.log('navn', navn);
            console.log('navn offset:', navn.offsetWidth);
        } */
    }, [orgnummer, erApen, hover]);

    /*
    const skalvise = (e: any) => {

        setAnker(e.currentTarget);

        if (anker) {
            console.log('anker', anker);
            console.log('anker pos', anker.getBoundingClientRect());

            const navn = anker.firstChild as HTMLElement;
            console.log('navn', navn);
            if (navn && navn.offsetWidth > maxBreddeAvKolonne) {
                setSkalVisePopover(true);
            }
        }
    }; */

    return (
        <div className="organisasjonsbeskrivelse">
            <Ikon classname="organisasjonsbeskrivelse__ikon" />
            <div
                id={`organisasjonsbeskrivelse${orgnummer}`}
                className="organisasjonsbeskrivelse__beskrivelse"
                onMouseOver={(e: any) => {

                    const navn = e.currentTarget.firstChild as HTMLElement;
                    if (navn.offsetWidth > 295) {
                        setSkalVisePopover(true);
                    }
                    console.log('e.currentTarger', e.currentTarget);
                    console.log('anker on hover:', anker);
                    console.log('anker rect:', anker!!.getBoundingClientRect());
                    // setAnker(e.currentTarget);
                    setHover(true);
                }}
                onMouseOut={() => {
                    setHover(false);
                    // setAnker(undefined);
                    setTimeout(() => {
                        setSkalVisePopover(false);
                    }, 800);

                }}
            >
                <Navn
                    className="organisasjonsbeskrivelse__navn"
                >
                    {navn}
                </Navn>
                <Normaltekst>org. nr. {orgnummer}</Normaltekst>
                {skalVisePopover && anker && hover && erApen && (
                    <Popover
                        ankerEl={anker}
                        orientering={PopoverOrientering.UnderVenstre}
                        avstandTilAnker={2}
                        utenPil>
                        <Normaltekst
                            className="organisasjonsbeskrivelse_popover-tekst"
                            style={{ padding: '0.3rem', color: '#000000', fontSize: '16px' }}>
                            {navn}
                        </Normaltekst>
                    </Popover>
                )}
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
