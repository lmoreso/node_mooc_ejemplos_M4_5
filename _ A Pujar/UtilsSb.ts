import * as strings from 'UtilSbWebPartStrings';
import { Web, sp } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
// declare var SP: any;
// import {SPAbstractService, EnvironmentService, FolderField} from '@raona/sp';


/**
 * Estados posibles despues de lanzar una query a SP (o a donde sea):
 *  - Se ha producido un error.
 *  - Se está efectuando la carga en este momento.
 *  - La carga de datos ha finalizado correctamente.
 * 
 */
export enum QueryResultStates { QRY_ERROR, QRY_1ST_LOADING, QRY_LOADING, QRY_LOADED }


/**
 * Resultado de lanzar una query a SP (o a donde sea):
 *  - Estado.
 *  - Nº de registros cargados.
 *  - Mensaje de Error.
 * 
 */
export interface ILoadSpResult {
    numRegs: number;
    msgErr: string;
    state: QueryResultStates;
}

/**
 * Campos Genéricos de StoreBoard pensados para filtrar, se corresponden con propiedades del usuario de SP propias de Mango.
 * 
 */
export interface IMngUserProps {
    Stock: TypeStockId;
    Country: ListCountryId;
    Role: ListRoleId;
    Location: ListLocationId;
    BusinessType: ListBusinessTypeId;
    ProductMnt: ListProductMntId[];
    isRetailUser: boolean;
}

/**
 * Devuelve un objeto de tipo IMngUserProps vacio:
 * 
 */
export function newIMngUserProps(): IMngUserProps {
    let userProps: IMngUserProps = {
        Stock: null,
        Country: null,
        Role: null,
        Location: null,
        BusinessType: null,
        ProductMnt: [],
        isRetailUser: false,
    };

    return (userProps);
}

/**
 * Propiedades de un Usuario / Conexión:
 * 
 */
export interface ISpUserProps {
    siteUrl: string;
    webUrl: string;
    cultureName: string;
    cultureLcid: number;
    idiomaSP: string;
    userEmail: string;
    loginName: string;
    userID?: string;
}


/**
 * Literal 'Global', usado en Mango para indicar que no debe aplicarse el filtro a una propiedad
 * 
 */
export const GLOBAL_KEY = 'Global';

/**
 * Id's de los tipos de Stock.
 * 
 */
export enum TypeStockId { D = 'Depósito', F = 'Firme', P = 'Propia' }

/**
 * Nombres de los Tipos de Stock.
 * 
 */
export const TYPE_STOCK_NAME = {
    "Depósito": strings.stockD,
    "Firme": strings.stockF,
    "Propia": strings.stockP,
};


/**
 * Lista de Paises contemplados en SharePoint.
 * 
 */
export enum ListCountryId { ES = 'España', FR = 'Francia', IT = 'Italia', GB = 'Reino Unido', TK = 'Turquia' }

/**
 * Nombres de los Paises.
 * 
 */
export const LIST_COUNTRY_NAME = {
    "España": strings.paisES,
    "Francia": strings.paisFR,
    "Italia": strings.paisIT,
    "Reino Unido": strings.paisUK,
    "Turquia": strings.paisTK,
};

/**
 * Lista de Roles contemplados en SharePoint.
 * 
 */
export enum ListRoleId { ST = 'Tienda', SM = 'Director de tienda', SU = 'Supervisor', CO = 'Coordinador', CM = 'Country Manager' }

/**
 * Nombres de los Roles.
 * 
 */
export const LIST_ROLE_NAME = {
    "Tienda": strings.roleST,
    "Director de tienda": strings.roleSM,
    "Supervisor": strings.roleSU,
    "Coordinador": strings.roleCO,
    "Country Manager": strings.roleCM,
};


/**
 * Lista de BusinessType contemplados en SharePoint.
 * 
 */
export enum ListBusinessTypeId { M = 'Mango', O = 'Outlet' }

/**
 * Nombres de los BusinessType.
 * 
 */
export const LIST_BUSINESS_TYPE_NAME = {
    "Mango": "Mango",
    "Outlet": "Outlet",
};

/**
 * Lista de ProductMnt contemplados en SharePoint.
 * 
 */
export enum ListProductMntId { W = 'Woman', M = 'Man', K = 'Kids', V = 'Violeta' }

/**
 * Nombres de los ProductMnt.
 * 
 */
export const LIST_PRODUCT_MNT_NAME = {
    "Woman": "Woman",
    "Man": "Man",
    "Kids": "Kids",
    "Violeta": "Violeta",
};

/**
 * Lista de Location contemplados en SharePoint.
 * 
 */
export enum ListLocationId { ST = 'Calle', CC = 'Centro Cial.', CO = 'Corner Cial.', AE = 'Aeropuerto' }

/**
 * Nombres de los Location.
 * 
 */
export const LIST_LOCATION_NAME = {
    "Calle": strings.locationST,
    "Centro Cial.": strings.locationCC,
    "Corner Cial.": strings.locationCO,
    "Aeropuerto": strings.locationAE,
};


let _isMemberOf = (site: string, groupName: string, user: string): any => {
    return new Promise(async (resolve) => {
        let web: any = new Web(site);
        web.siteGroups.getByName(groupName).users.get().then((members) => {
            members.some(member => {
                if (member.Email === user) {
                    resolve(true);
                }
            });
            resolve(false);
        });
    });
};


/**
 * Rellena propiedades de la conexión/usuario en base al contexto.
 * 
 */
export function getSpUserProps(context: WebPartContext, urlSubSite?: string): ISpUserProps {
    let spProps: ISpUserProps = {
        siteUrl: context.pageContext.site.absoluteUrl,
        webUrl: context.pageContext.web.absoluteUrl + '/Manuals',
        cultureName: context.pageContext.legacyPageContext.currentUICultureName,
        cultureLcid: context.pageContext.legacyPageContext.currentLanguage,
        userEmail: context.pageContext.user.email,
        loginName: context.pageContext.user.loginName,
        idiomaSP: context.pageContext.legacyPageContext.currentUICultureName.substring(0, 2),
    };

    return (spProps);
}


/**
 * Rellena las propiedades de usuario propias de Mango (isretailUser, stock, country, etc.)
 * Es necesario que vengan informados los campos de ISpUserProps (siteUrl, userEmail, etc.)
 * 
 */
export async function getMngUserProps(spProps: ISpUserProps, mngProps: IMngUserProps) {
    // console.log('UtilsSb.getMngUserProps: mngProps (primer paso)', mngProps);

    // Miramos si es usuario de Retail
    mngProps.isRetailUser = await _isMemberOf(spProps.siteUrl, "Retail", spProps.userEmail);

    // Recuperamos otras propiedades del usuario
    let web: any = new Web(spProps.siteUrl);
    let currUser = await web.currentUser.get();
    let userProps = await sp.profiles.getPropertiesFor(currUser.LoginName);
    //console.log(userProps.UserProfileProperties);
    // mngProps = {
    //     isRetailUser: isRetailUser,
    //     BusinessType: userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGBusinessType'; }).Value,
    //     Country: userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGCountry'; }).Value,
    //     Location: userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGLocation'; }).Value,
    //     ProductMnt: userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGProductMnt'; }).Value,
    //     Role: userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGRole'; }).Value,
    //     Stock: userProps.UserProfileProperties.find((element) => { return element.Key == "MNGStock"; }).Value,
    // };
    mngProps.BusinessType = userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGBusinessType'; }).Value;
    mngProps.Country = userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGCountry'; }).Value;
    mngProps.Location = userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGLocation'; }).Value;
    mngProps.ProductMnt = userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGProductMnt'; }).Value;
    mngProps.Role = userProps.UserProfileProperties.find((element) => { return element.Key == 'MNGRole'; }).Value;
    mngProps.Stock = userProps.UserProfileProperties.find((element) => { return element.Key == "MNGStock"; }).Value;
}


export function getImageUrlFromHtmlField(htmlField: string): string {
    let imageUrl: string = "";
    const src: string[] = /<img.*?src="(.*?)"/.exec(htmlField);
    if (src !== null && src.length > 1) {
      imageUrl = src[1];
    }
    return imageUrl;
  }
