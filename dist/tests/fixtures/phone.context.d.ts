declare const _default: {
    '@context': {
        '@id': string;
        '@context': string;
        '@type': string;
        properties: {
            sequence_number: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    numericality: {
                        only_integer: boolean;
                        allow_nil: boolean;
                        greater_than: number;
                    };
                }[];
                type: string;
            };
            created_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            updated_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            user_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            label: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: {
                    inclusion: {
                        in: string[];
                    };
                }[];
                type: string;
            };
            number: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: {
                    format: {
                        with: string;
                        message: string;
                    };
                }[];
                type: string;
            };
            user: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
        };
        constants: {
            labels: string[];
        };
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
            update: {
                method: string;
                expects: string;
                resource: string;
                response: string;
                template: string;
                mappings: {
                    variable: string;
                    source: string;
                    required: boolean;
                }[];
            };
            delete: {
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
                mappings: ({
                    variable: string;
                    source: string;
                    required: boolean;
                } | {
                    variable: string;
                    source: string;
                    required?: undefined;
                } | {
                    variable: string;
                    source?: undefined;
                    required?: undefined;
                })[];
            };
            create: {
                method: string;
                expects: string;
                resource: string;
                response: string;
                template: string;
                mappings: {
                    variable: string;
                    required: boolean;
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
            update: {
                method: string;
                expects: string;
                resource: string;
                response: string;
                template: string;
                mappings: {
                    variable: string;
                    source: string;
                    required: boolean;
                }[];
            };
            delete: {
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
        associations: {
            user: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
        };
    };
};
export default _default;
