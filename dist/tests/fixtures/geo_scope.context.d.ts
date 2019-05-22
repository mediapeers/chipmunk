declare const _default: {
    '@context': {
        '@id': string;
        '@context': string;
        '@type': string;
        properties: {
            id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ({
                    length: {
                        is: number;
                    };
                    format?: undefined;
                    uniqueness?: undefined;
                } | {
                    format: {
                        with: string;
                    };
                    length?: undefined;
                    uniqueness?: undefined;
                } | {
                    uniqueness: {
                        scope: string;
                    };
                    length?: undefined;
                    format?: undefined;
                })[];
                type: string;
            };
            eu_vat_member: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            former: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            iso_3166: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ({
                    length: {
                        in: string;
                        allow_nil: boolean;
                    };
                    format?: undefined;
                    uniqueness?: undefined;
                } | {
                    format: {
                        with: string;
                        allow_nil: boolean;
                    };
                    length?: undefined;
                    uniqueness?: undefined;
                } | {
                    uniqueness: {
                        scope: string;
                        allow_nil: boolean;
                    };
                    length?: undefined;
                    format?: undefined;
                })[];
                type: string;
            };
            name: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ({
                    length: {
                        within: string;
                    };
                    uniqueness?: undefined;
                } | {
                    uniqueness: {
                        scope: string;
                    };
                    length?: undefined;
                })[];
                type: string;
            };
            number: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    numericality: {
                        only_integer: boolean;
                        allow_nil: boolean;
                        less_than: number;
                        greater_than: number;
                    };
                }[];
                type: string;
            };
            parent_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            ancestry: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
        };
        constants: {};
        member_actions: {
            get: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: {
                    variable: string;
                    source: string;
                    required: boolean;
                }[];
            };
        };
        collection_actions: {
            query: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: {
                    variable: string;
                    source: string;
                }[];
            };
            graph: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: any[];
            };
            countries: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: {
                    variable: string;
                    source: string;
                }[];
            };
            get: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: {
                    variable: string;
                    source: string;
                    required: boolean;
                }[];
            };
        };
        action: FunctionConstructor[];
        associations: {};
    };
};
export default _default;
