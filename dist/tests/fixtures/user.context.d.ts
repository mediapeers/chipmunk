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
                validations: {
                    inclusion: {
                        in: string[];
                    };
                }[];
                type: string;
            };
            organization_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            role_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            responsible_user_id: {
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
            group_ids: {
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
            approved_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            invited_at: {
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
            blocked_at: {
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
            authenticatable: {
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
            login_count: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            last_login_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            current_ip: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            password_reset_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            terms_accepted_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            terms_accepted: {
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
            accessor_group_ids: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            analytics_subscription: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            supervisor_analytics_subscription: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            email: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: ({
                    email: boolean;
                    uniqueness?: undefined;
                } | {
                    uniqueness: {
                        scope: string;
                        case_sensitive: boolean;
                    };
                    email?: undefined;
                })[];
                type: string;
            };
            tags: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        maximum: number;
                    };
                }[];
                type: string;
            };
            external_reference: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    uniqueness: {
                        scope: string;
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            division_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            analytics_playback_attachment_all: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            supervisor_analytics_playback_attachment: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            supervisor_analytics_playback_attachment_all: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            first_name: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: {
                    length: {
                        in: string;
                    };
                }[];
                type: string;
            };
            last_name: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                required: boolean;
                validations: {
                    length: {
                        in: string;
                    };
                }[];
                type: string;
            };
            middle_name: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        in: string;
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            gender: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    inclusion: {
                        in: string[];
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            title: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    inclusion: {
                        in: string[];
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            department: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        in: string;
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            assistant: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        in: string;
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            function: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        in: string;
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            website: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        in: string;
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            fax: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        in: string;
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            date_of_birth: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            mobile_sync: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            notes: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            preview_image_id: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            customer_segment: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    inclusion: {
                        in: string[];
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            responsibility: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    inclusion: {
                        in: string[];
                        allow_blank: boolean;
                    };
                }[];
                type: string;
            };
            interests: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            company_profile: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            source_updated_at: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            skip_marketing_emails: {
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                type: string;
            };
            territory_rep: {
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
                validations: {
                    length: {
                        maximum: number;
                    };
                }[];
            };
            groups: {
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
                required: boolean;
            };
            responsible_user: {
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
            password: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            phones: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        maximum: number;
                    };
                }[];
            };
            im_contacts: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        maximum: number;
                    };
                }[];
            };
            social_media_profiles: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
                validations: {
                    length: {
                        maximum: number;
                    };
                }[];
            };
            address: {
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
            division: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
            preview_image: {
                type: string;
                collection: boolean;
                readable: boolean;
                writable: boolean;
                exportable: boolean;
            };
        };
        constants: {
            access_levels: string[];
            titles: string[];
            genders: string[];
            status: string[];
            customer_segments: string[];
            responsibilities: string[];
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
            invite: {
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
            approve: {
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
            block: {
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
            unblock: {
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
            reject: {
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
                }[];
            };
            add_geo_scopes: {
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
                    required: boolean;
                    source?: undefined;
                })[];
            };
            remove_geo_scopes: {
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
                    required: boolean;
                    source?: undefined;
                })[];
            };
            update_geo_scopes: {
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
                    required: boolean;
                    source?: undefined;
                })[];
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
                    required?: undefined;
                } | {
                    variable: string;
                    source?: undefined;
                    required?: undefined;
                } | {
                    variable: string;
                    required: boolean;
                    source?: undefined;
                })[];
            };
            search: {
                method: string;
                expects: any;
                resource: string;
                response: string;
                template: string;
                mappings: ({
                    variable: string;
                    source: string;
                    required?: undefined;
                } | {
                    variable: string;
                    source?: undefined;
                    required?: undefined;
                } | {
                    variable: string;
                    required: boolean;
                    source?: undefined;
                })[];
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
            invite: {
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
            approve: {
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
            review: {
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
            block: {
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
            unblock: {
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
            reject: {
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
                }[];
            };
            query_groups: {
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
                    source?: undefined;
                    required?: undefined;
                } | {
                    variable: string;
                    required: boolean;
                    source?: undefined;
                })[];
            };
        };
    };
};
export default _default;
