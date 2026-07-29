export interface Paginacion {
    page : number;
    limit : number;
    totalItems : number;
    totalPages : number;
    hasNextPage : boolean;
    hasPreviousPage : boolean
}