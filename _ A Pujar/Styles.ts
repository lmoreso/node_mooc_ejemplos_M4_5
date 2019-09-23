import { mergeStyleSets, getTheme } from 'office-ui-fabric-react/lib/Styling';

// const unaImagen = require('../public/FotoExample.jpg');


// Estilos varios utilizados en este componente
const theme = getTheme();
export const styles = mergeStyleSets({
    msgErr: {
        //padding: '18px 24px 12px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'red', //theme.semanticColors.menuHeader,
        fontWeight: 'bold',
        padding: '2px',
        color: 'red',
        marginTop: '12px',
    },
    fichaManual: {
        // backgroundImage: unaImagen.toString(),
        backgroundColor: theme.palette.neutralLight,
        padding: '8px',
        margin: '4px',
        width: '200px',
        height: '200px',
        float: 'left',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        selectors: {
            '&:hover': {
                backgroundColor: theme.palette.neutralTertiary,
            }
        },
    },
    fichaManualImage: {
        padding: '8px',
        margin: '4px',
        width: '200px',
        height: '200px',
        float: 'left',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        backgroundImage: '/sites/dev-storeboard/PublishingImages/cashier.jpg noRepeat fixed center',
        backgroundSize: 'cover',
    },
    fichaManualContainer: {
        borderWidth: 'thin',
        borderStyle: 'solid',
        borderColor: 'gray', //theme.semanticColors.menuHeader,
        padding: '4px',
        margin: '2px',
        display: 'flex',
        flexWrap: 'wrap',
    },
});
