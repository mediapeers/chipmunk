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
            access_level: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            responsible_user_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            currency_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            language_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            geo_scope_ids: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            status: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            activated_at: {
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
            deleted_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            users_count: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            country_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            name: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            email: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            tags: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            group_ids: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            external_reference: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            classification: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            legal_entity: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            registration_number: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            tax_number: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            vat_number: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            vat_rate: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            withholding_tax_rate: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
                type: string;
            };
            source_updated_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            geo_scopes: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            responsible_user: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            groups: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            users: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            aliases: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            key_persons: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            phones: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            im_contacts: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            social_media_profiles: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            urls: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            addresses: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            legal_address: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            country: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            bank_accounts: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            courier_services: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            currency: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            language: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            delivery_profiles: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
        };
        constants: {
            access_levels: string[];
            legal_entities: string[];
            classifications: string[];
            status: string[];
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
            restore: {
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
            add_geo_scopes: {
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
            remove_geo_scopes: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: ArrayConstructor[];
            };
            update_geo_scopes: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: ArrayConstructor[];
            };
            query_users: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: ArrayConstructor[];
            };
            query_groups: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: ArrayConstructor[];
            };
        };
        collection_actions: {
            query: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: ArrayConstructor[];
            };
            create: {
                method: string;
                expects: string;
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
            restore: {
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
            query_users: {
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
            geo_scopes: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            responsible_user: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            groups: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            users: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            aliases: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            key_persons: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            phones: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            im_contacts: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            social_media_profiles: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            urls: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            addresses: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            legal_address: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            country: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            bank_accounts: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            courier_services: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: ArrayConstructor[];
            };
            currency: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            language: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            delivery_profiles: {
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
