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
                type: string;
            };
            email: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            password: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
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
            fyc_campaign_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            affiliation: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            user: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            organization: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            role: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            powers: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            groupings: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            protection_checks: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
        };
        constants: {};
        member_actions: {
            create: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: any[];
            };
            get: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: any[];
            };
            full: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: any[];
            };
            delete: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: any[];
            };
        };
        collection_actions: {
            impersonate: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: any[];
            };
        };
    };
};
export default _default;
