import { useCallback, useState, useEffect } from 'react';
import { JuridiskEnhetMedUnderEnheterArray } from '../organisasjon';

export const useRoveFocus = (dropdownref: HTMLDivElement|null, antallUnderenheter: number, menyKomponenter?: JuridiskEnhetMedUnderEnheterArray[]): [number, (n: number) => void, number, (n: number) => void, boolean, (bool: boolean) => void, number, (n: number) => void, number, (n: number) => void] => {
    const size = menyKomponenter ? menyKomponenter.length : 0;

    const [currentFocusJuridiskEnhet, setCurrentFocusJuridiskEnhet] = useState<number>(-1);
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
            if (ref && !ref.contains(e.target as HTMLElement)) {
                return;
            }
            if (e.keyCode === 40) { // Down arrow
                e.preventDefault();
                console.log('down-key current', currentFocusJuridiskEnhet);
                console.log('down-key trykkethoyrepilIndex', trykketHoyrepilIndex);

                if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex !== currentFocusJuridiskEnhet) {
                    // Key-down første gang. Trykket høyre og skal sette fokus på første underenhet.
                    console.log('trykketHoyrepil=true. Trykket nedpil, første gang');
                    // Set state trykketNedpil:
                    setTrykketNedIndex(currentFocusJuridiskEnhet);
                    console.log('trykket pil ned. Antall underenheter:', antallUnderenheter);
                    // sett fokus på første underenhet
                    setFocusUnderenhet(0);

                } else if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex === currentFocusJuridiskEnhet) {
                    // Key-down. Trykket høyre og nedpil, ikke første. Skal sette fokus på neste underenhet
                    setFocusUnderenhet(currentFocusUnderenhet === antallUnderenheter - 1 ? 0 : currentFocusUnderenhet + 1);

                } else {
                    // Ikke trykket høyre. Sett fokus på neste juridisk enhet.
                    setFocusUnderenhet(0);
                    setCurrentFocusJuridiskEnhet(currentFocusJuridiskEnhet === size - 1 ? 0 : currentFocusJuridiskEnhet + 1);
                }

            } else if (e.keyCode === 38) { // Up arrow
                e.preventDefault();
                console.log('up current', currentFocusJuridiskEnhet);
                console.log('up trykkethoyrepil', trykketHoyrepilIndex);

                // Enten juridisk enhet eller underenhet. Hvis trykket høyre og pil ned, da er fokus nå på underenhet
                if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex === currentFocusJuridiskEnhet) {
                    // fokus er på underenhet
                    if (currentFocusUnderenhet === 0) {
                        // fokus er på første underenhet, og skal da sette fokus på juridisk enhet.
                        console.log('Første underenhet. currentFocusUnderenhet === 0');
                        setFocusJuridiskEnhet(currentFocusJuridiskEnhet);
                        setFocusUnderenhet(0);
                        setTrykketNedIndex(-1);
                    } else {
                        // fokus er på underenhet, ikke første
                        // sett fokus på forrige underenhet
                        console.log('Ikke første underenhet. currentFocusUnderenhet !== 0');
                        setFocusUnderenhet(currentFocusUnderenhet - 1);
                    }

                /* } else if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil && trykketNedpilIndex !== currentFocusJuridiskEnhet) {
                    // Fokus på Juridisk enhet. Åpen, men nedpil er ikke trykket */

                } else { // fokus er på juridisk enhet som ikke er åpen eller er åpen, men ikke nedpil trykket
                    if (currentFocusJuridiskEnhet === 0) {
                        // fokus er på første juridisk enhet
                        setFocusUnderenhet(0);
                        sokefelt?.focus();
                    } else {
                        // sett fokus på forrige juridisk enhet
                        setCurrentFocusJuridiskEnhet(currentFocusJuridiskEnhet - 1);
                    }
                }
            } else if (e.keyCode === 39) { // Right arrow
                e.preventDefault();
                setTrykketHoyre(true);
                setTrykketHoyreIndex(currentFocusJuridiskEnhet);
                // setCurrentFocusJuridiskEnhet(currentFocusJuridiskEnhet);
            } else if (e.keyCode === 13) { // Enter
                // e.preventDefault();
                if (trykketHoyrepilIndex === currentFocusJuridiskEnhet && trykketHoyrepil) { // trykket høyre/fokus er på underenhet
                    if (currentFocusUnderenhet === 0) { // første element, og skal da sette fokus på juridisk enhet.
                        // juridiskenhet?.focus();
                        // sett fokus juridisk enhet true
                        setFocusUnderenhet(0);
                    } else {
                        // sett fokus på forrige underenhet
                        setFocusUnderenhet(currentFocusUnderenhet - 1);
                    }
                }
            }
        },
        [size, antallUnderenheter, dropdownref, currentFocusJuridiskEnhet, setCurrentFocusJuridiskEnhet, trykketHoyrepilIndex, setTrykketHoyrepilIndex, trykketHoyrepil, setTrykketHoyrepil, currentFocusUnderenhet, setFocusUnderenhet, trykketNedpilIndex, setTrykketNedpilIndex]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown, false);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, false);
        };
    }, [handleKeyDown]);

    return [currentFocusJuridiskEnhet, setFocusJuridiskEnhet, trykketHoyrepilIndex, setTrykketHoyreIndex, trykketHoyrepil, setTrykketHoyre, currentFocusUnderenhet, setFocusUnderenhet, trykketNedpilIndex, setTrykketNedIndex];
};