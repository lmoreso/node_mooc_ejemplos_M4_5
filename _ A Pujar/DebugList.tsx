import * as React from 'react';
import { mergeStyleSets, getTheme } from 'office-ui-fabric-react/lib/Styling';
import { VOrderMenu, VOrderMenuOptions } from './VUtilsSb';


export interface IDebugListConfig {
    tituloColumna: string;
    anchoColumna: number;
    nombreColumna: string;
    linkColumna?: string;
}

export interface IDebugListRenderProps {
    debug: DebugList;
    datos: any[];
    onOrderBy: (orden: VOrderMenuOptions) => void; 
}

export function DebugListRenderTable(props: IDebugListRenderProps): React.ReactElement<{}> {
    return (props.debug.renderTable(props.datos, props.onOrderBy));
}

export class DebugList {
    public config: IDebugListConfig[];
    public descripcion: string;
    private _colsNames: string;
    private _colsSubs: string;
    private static _subChar: string = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    private static _subSpace: string = "                                                                                                              ";

    public constructor(descripcion: string, listItems: IDebugListConfig[]) {
        this.config = listItems;
        this.descripcion = descripcion;
        // Construcción de las dos líneas de título:
        this._colsNames = "";
        this._colsSubs = "";
        this.config.forEach((item: IDebugListConfig) => {
            var aux: string = item.tituloColumna + DebugList._subSpace;
            this._colsNames = this._colsNames + aux.substr(0, item.anchoColumna) + " ";
            this._colsSubs = this._colsSubs + DebugList._subChar.substr(0, item.anchoColumna) + " ";
        });
    }

    public length(): number {
        return (this.config.length);
    }

    public getTitle(numRegs?: number): string {
        if (numRegs !== undefined)
            return (`${this.descripcion.replace('%n', numRegs.toString())}`);
        else
            return (`No se ha encontrado ningún Registro:`);

    }

    public getColsNames(): string {
        return (this._colsNames);
    }

    public getColsSubs(): string {
        return (this._colsSubs);
    }

    public getLine(dato: Object): string {
        let sAux: string = "";
        let sAux2: string;

        this.config.forEach((item: IDebugListConfig) => {
            sAux2 = dato[item.nombreColumna];
            if (sAux2) {
                sAux2 = sAux2 + DebugList._subSpace;
            } else {
                sAux2 = DebugList._subSpace;
            }
            sAux = sAux + sAux2.substr(0, item.anchoColumna) + " ";
        });

        return (sAux);
    }

    /**
     * console: Escribe la lista de datos en la consola
     */
    public console(listDatos: any[]) {
        if (this.length() === 0) {
            console.log("DebugList-No hay Configuración que pintar");
            return;
        }
        // Título 
        console.log(this.getTitle(listDatos.length));
        // Pintar los títulos de las Columnas
        console.log(this.getColsNames());
        console.log(this.getColsSubs());
        // Pintar los Datos
        listDatos.forEach((dato: any) => {
            console.log(this.getLine(dato));
        });
    }
    /**
     * console: Escribe la lista de datos en la consola
     */

    public htmlSimple(listDatos: any[]): string {
        let retVal: string;

        retVal = '<div style="font: small monospace">';  // DIV principal
        retVal += '<p style="font: bold small monospace">';  // Titulo
        retVal += this.getTitle(listDatos.length);
        retVal += '</p>';  // Titulo
        retVal += '<p style="font: bold small monospace">';  // Columnas
        retVal += this.getColsNames();
        retVal += '</p>';  // Columnas
        retVal += '<p style="font: bold small monospace">';  // Subrayado Columnas
        retVal += this.getColsSubs();
        retVal += '</p>';  // Subrayado Columnas
        // Pintar los Datos
        listDatos.forEach((dato: any) => {
            retVal += '<p style="font: small monospace">';  // inicio dato
            retVal += this.getLine(dato);
            retVal += '</p>';  // fin dato
        });
        retVal += '</div>';  // DIV principal

        return (retVal);
    }

    public renderTable(listDatos: any[], onOrderBy: (orden: VOrderMenuOptions) => void): React.ReactElement<{}> {
        const color = getTheme().palette.neutralPrimary;
        const estilos = mergeStyleSets({
            title: {
                fontSize: 'small',
                margin: '4px',
            },
            tabla: {
                fontSize: 'small',
                borderWidth: '1px',
                borderColor: color,
                borderStyle: 'solid',
            },
            cellsTit: {
                fontSize: 'small',
                borderWidth: '1px',
                borderColor: color,
                borderStyle: 'solid',
                backgroundColor: color,
                color: 'white',
            },
            cells: {
                fontSize: 'small',
                borderWidth: '1px',
                borderColor: color,
                borderStyle: 'solid',
            },
        });

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <label className={estilos.title}>{this.getTitle(listDatos.length)}</label>
                    <span className={estilos.title}><VOrderMenu onOrderBy={onOrderBy}/></span>
                </div>
                <table className={estilos.tabla}>
                    <thead >
                        <tr>
                            {this.config.map((item: IDebugListConfig) => {
                                return (
                                    <th className={estilos.cellsTit}>{item.tituloColumna}</th>
                                );
                            })}
                        </tr>

                    </thead>
                    <tbody >
                        {listDatos.map((dato: any) => {
                            return (
                                <tr>
                                    {this.config.map((item: IDebugListConfig) => {
                                        if (item.linkColumna) {
                                            return (
                                                <td className={estilos.cells}><a href={dato[item.linkColumna]} target='_blank'>{dato[item.nombreColumna]}</a></td>
                                            );
                                        } else {
                                            return (
                                                <td className={estilos.cells}>{dato[item.nombreColumna]}</td>
                                            );
                                        }
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}