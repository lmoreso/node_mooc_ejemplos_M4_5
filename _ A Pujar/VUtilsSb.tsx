import * as React from 'react';
import { IContextualMenuProps } from 'office-ui-fabric-react/lib/ContextualMenu';
import { DefaultButton } from 'office-ui-fabric-react/lib/components/Button';


export enum VOrderMenuOptions { none, newer, older, popular, alfaAsc, alfaDesc }
export interface IVOrderMenuNames {
    key: VOrderMenuOptions;
    name: string;
}
export const ORDER_OPTION_NAMES: IVOrderMenuNames[] = [
    { key: VOrderMenuOptions.none, name: 'Ordenar' },
    { key: VOrderMenuOptions.newer, name: 'Ordenar por mas Recientes' },
    { key: VOrderMenuOptions.older, name: 'Ordenar por mas Antiguos' },
    { key: VOrderMenuOptions.popular, name: 'Ordenar por mas Consultados' },
    { key: VOrderMenuOptions.alfaAsc, name: 'Ordenar de A a Z' },
    { key: VOrderMenuOptions.alfaDesc, name: 'Ordenar de Z a A' },
];

export interface IVOrderMenuState {
    orderOption: VOrderMenuOptions;
}

export interface IVOrderMenuProps {
    onOrderBy: (orden: VOrderMenuOptions) => void;
}

export class VOrderMenu extends React.Component<IVOrderMenuProps, IVOrderMenuState> {
    // Data for menu
    private _menuOrdenar: IContextualMenuProps = { items: [] };

    public constructor(props) {
        super(props);

        // Inicializar Estados
        this.state = {
            orderOption: VOrderMenuOptions.none,
        };

        // Inicializar opciones
        ORDER_OPTION_NAMES.forEach(valor => {
            if (valor.key != VOrderMenuOptions.none) {
                this._menuOrdenar.items.push({
                    key: valor.key.toString(), name: valor.name,
                    onClick: () => {
                        if (valor.key != VOrderMenuOptions.none && valor.key != this.state.orderOption) {
                            this.props.onOrderBy(valor.key);
                            this.setState({ orderOption: valor.key });
                        }
                    }
                });
            }
        });

        // Binds
        // this._onChangeComboStock = this._onChangeComboStock.bind(this);
    }
    public render(): React.ReactElement<{}> {
        return (
            <div>
                <DefaultButton
                    text={ORDER_OPTION_NAMES[this.state.orderOption].name}
                    menuProps={this._menuOrdenar}
                    iconProps={{ iconName: 'SortLines' }}
                />
            </div>
        );
    }
}