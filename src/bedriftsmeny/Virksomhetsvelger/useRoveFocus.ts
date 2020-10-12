import { useCallback, useState, useEffect } from 'react';
import { JuridiskEnhetMedUnderEnheterArray } from '../organisasjon';

export const useRoveFocus = (dropdownnode: HTMLDivElement|null, antallUnderenheter: number, menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[]): [number, (n: number) => void, number, (n: number) => void, boolean, (bool: boolean) => void, number, (n: number) => void, number, (n: number) => void] => {
    const size = menyKomponenter ? menyKomponenter.length : 0;

    const [currentFocusJuridiskEnhet, setCurrentFocusJuridiskEnhet] = useState<number>(0);
    const setFocusJuridiskEnhet = (n: number) => setCurrentFocusJuridiskEnhet(n);

    const [trykketHoyrepilIndex, setTrykketHoyrepilIndex] = useState(-1);
    const setTrykketHoyreIndex = (n: number) => setTrykketHoyrepilIndex(n);

    const [trykketHoyrepil, setTrykketHoyrepil] = useState(false);
    const setTrykketHoyre = (bool: boolean) => setTrykketHoyrepil(bool);

    const [currentFocusUnderenhet, setCurrentFocusUnderenhet] = useState<number>(0);
    const setFocusUnderenhet = (n: number) => setCurrentFocusUnderenhet(n);

    const [trykketNedpilIndex, setTrykketNedpilIndex] = useState<number>(-1);
    const setTrykketNedIndex = (n: number) => setTrykketNedpilIndex(n);

    const sokefelt = document.querySelector('#bedriftsmeny-sokefelt') as HTMLElement;

    const handleKeyDown = useCallback(
        (e) => {
            // @ts-ignore
            if (dropdownnode && dropdownnode.contains(e.target as HTMLElement)) {
                if (e.keyCode === 40) { // Down arrow
                    e.preventDefault();

                    if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex !== currentFocusJuridiskEnhet) {
                        console.log('Key-down første gang. Trykket høyre og nedpil og skal sette fokus på første underenhet. Antall underenheter: ', antallUnderenheter);

                        // Set state trykketNedpil:
                        setTrykketNedIndex(currentFocusJuridiskEnhet);
                        setFocusUnderenhet(0);
                        console.log('key-down current', currentFocusJuridiskEnhet);
                        console.log('key-down trykkethoyrepilIndex', trykketHoyrepilIndex);
                        console.log('key-down current underEnhet', currentFocusUnderenhet);

                    } else if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex === currentFocusJuridiskEnhet) {
                        console.log('Key-down. Trykket høyre og nedpil, ikke første. Skal sette fokus på neste underenhet');

                        setFocusUnderenhet(currentFocusUnderenhet === antallUnderenheter - 1 ? 0 : currentFocusUnderenhet + 1);
                        console.log('key-down current', currentFocusJuridiskEnhet);
                        console.log('key-down trykkethoyrepilIndex', trykketHoyrepilIndex);
                        console.log('key-down current underEnhet', currentFocusUnderenhet);

                    } else {
                        console.log('Ikke trykket høyre. Sett fokus på neste juridisk enhet.');

                        setFocusUnderenhet(0);
                        setCurrentFocusJuridiskEnhet(currentFocusJuridiskEnhet === size - 1 ? 0 : currentFocusJuridiskEnhet + 1);
                        console.log('key-down current', currentFocusJuridiskEnhet);
                        console.log('key-down trykkethoyrepilIndex', trykketHoyrepilIndex);
                        console.log('key-down current underEnhet', currentFocusUnderenhet);
                    }

                } else if (e.keyCode === 38) { // Up arrow
                    e.preventDefault();
                    console.log('up current', currentFocusJuridiskEnhet);
                    console.log('up trykkethoyrepil', trykketHoyrepilIndex);

                    // Enten juridisk enhet eller underenhet. Hvis trykket høyre og pil ned, da er fokus nå på underenhet
                    if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex === currentFocusJuridiskEnhet) {
                        // fokus er på underenhet
                        if (currentFocusUnderenhet === 0) {
                            console.log('fokus er på første underenhet, og skal da sette fokus på juridisk enhet. currentFocusUnderenhet === 0');
                            setTrykketNedpilIndex(-1);
                        } else {
                            console.log('fokus er på underenhet, ikke første. currentFocusUnderenhet !== 0');
                            // sett fokus på forrige underenhet
                            setFocusUnderenhet(currentFocusUnderenhet - 1);
                        }

                    } else if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex === -1) {
                        console.log('Fokus på Juridisk enhet. Åpen, men nedpil er ikke trykket');

                        setFocusUnderenhet(0);
                        // sett fokus på forrige juridisk enhet
                        if (currentFocusJuridiskEnhet === 0) {
                            console.log('fokus er på første juridisk enhet');
                            sokefelt?.focus();
                        } else {
                            console.log('sett fokus på forrige juridiske enhet');
                            setCurrentFocusJuridiskEnhet(currentFocusJuridiskEnhet - 1);
                        }

                    } else {
                        // fokus er på juridisk enhet som ikke er åpen
                        if (currentFocusJuridiskEnhet === 0) {
                            console.log('fokus er på første juridisk enhet');
                            setFocusUnderenhet(0);
                            setTrykketHoyreIndex(-1);
                            setTrykketHoyre(false);
                            sokefelt?.focus();
                        } else {
                            console.log('sett fokus på forrige juridiske enhet');
                            setCurrentFocusJuridiskEnhet(currentFocusJuridiskEnhet - 1);
                        }
                    }

                } else if (e.keyCode === 39) { // Right arrow
                    e.preventDefault();
                    console.log('Høyrepil trykket. Skal sette status TRYKKET, slik at underenhetene vises');
                    if (trykketHoyrepilIndex === -1 && !trykketHoyrepil && trykketNedpilIndex === -1) {
                        setTrykketHoyre(true);
                        setTrykketHoyreIndex(currentFocusJuridiskEnhet);
                    }

                } else if (e.keyCode === 37) { // Left arrow
                    e.preventDefault();

                    if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex === -1) {
                        console.log('Venstepiltrykket. Jjuridisk enhet er åpen. Fokus er på juridisk enhet. Sett trykketHøyre=false');
                        setTrykketHoyre(false);
                        setTrykketHoyreIndex(-1);
                        setTrykketNedIndex(-1);

                    }
                } else if (e.keyCode === 13) { // Enter
                    // e.preventDefault();

                    /* if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex === -1) {
                        console.log('trykket Enter/juridisk enhet er åpen. Fokus er på juridisk enhet. Sett trykketHøyre=false');
                        setTrykketHoyre(false);
                        setTrykketHoyreIndex(-1);

                    } else if (trykketHoyrepilIndex === -1 && !trykketHoyrepil && trykketNedpilIndex === -1) {
                        console.log('trykket Enter/juridisk enhet er IKKE åpen. Fokus er på juridisk enhet. Sett trykketHøyre=true');
                        setTrykketHoyre(true);
                        setTrykketHoyreIndex(currentFocusJuridiskEnhet);
                    } */
                }
            } else return;
        },
        [menyKomponenter, antallUnderenheter, dropdownnode, currentFocusJuridiskEnhet, setCurrentFocusJuridiskEnhet, trykketHoyrepilIndex, setTrykketHoyrepilIndex, trykketHoyrepil, setTrykketHoyrepil, currentFocusUnderenhet, setCurrentFocusUnderenhet, trykketNedpilIndex, setTrykketNedpilIndex]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown, false);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, false);
        };
    }, [handleKeyDown]);

    return [currentFocusJuridiskEnhet, setFocusJuridiskEnhet, trykketHoyrepilIndex, setTrykketHoyreIndex, trykketHoyrepil, setTrykketHoyre, currentFocusUnderenhet, setFocusUnderenhet, trykketNedpilIndex, setTrykketNedIndex];
};