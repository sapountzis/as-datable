<!-- src/lib/components/CookieConsent.svelte -->
<script>
    import { onMount } from 'svelte';
    import 'vanilla-cookieconsent/dist/cookieconsent.css';
    import * as CookieConsent from 'vanilla-cookieconsent';

    onMount(() => {
       
        CookieConsent.run({
            cookie: {
                name: 'cc_cookie',
                expiresAfterDays: 182,
            },
            guiOptions: {
                consentModal: {
                    layout: 'cloud inline',
                    position: 'bottom center',
                    equalWeightButtons: true,
                },
                preferencesModal: {
                    layout: 'box',
                    equalWeightButtons: true,
                }
            },
            categories: {
                necessary: {
                    enabled: true,
                    readOnly: true
                },
                analytics: {
                    autoClear: {
                        cookies: [
                            {
                                name: /^_ga/,  // All cookies starting with _ga
                            },
                            {
                                name: '_gid',
                            }
                        ]
                    },
                    services: {
                        ga: {
                            label: 'Google Analytics',
                            onAccept: () => {
                                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                                    window.gtag('consent', 'update', {
                                        'analytics_storage': 'granted',
                                        'ad_storage': 'granted',
                                        'ad_user_data': 'granted',
                                        'ad_personalization': 'granted'
                                    });
                                }
                            },
                            onReject: () => {
                                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                                    window.gtag('consent', 'update', {
                                        'analytics_storage': 'denied',
                                        'ad_storage': 'denied',
                                        'ad_user_data': 'denied',
                                        'ad_personalization': 'denied'
                                    });
                                }
                            }
                        }
                    }
                }
            },
            language: {
                default: 'en',
                translations: {
                    en: {
                        consentModal: {
                            title: 'We value your privacy',
                            description: 'We use cookies to enhance your browsing experience and analyze site traffic.',
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            showPreferencesBtn: 'Manage preferences',
                        },
                        preferencesModal: {
                            title: 'Privacy Preferences',
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            savePreferencesBtn: 'Save preferences',
                            closeIconLabel: 'Close',
                            sections: [
                                {
                                    title: 'Essential Cookies',
                                    description: 'These cookies are necessary for the website to function and cannot be disabled.',
                                    linkedCategory: 'necessary'
                                },
                                {
                                    title: 'Analytics Cookies',
                                    description: 'These cookies help us understand how visitors interact with our website. All data is anonymized.',
                                    linkedCategory: 'analytics',
                                }
                            ]
                        }
                    }
                }
            },
        });
    });
</script>