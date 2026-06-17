import re
from urllib.parse import urlparse

def extract_features(url: str) -> list:
    features = []

    try:
        parsed = urlparse(url if url.startswith('http') else 'http://' + url)
        domain = parsed.netloc.lower()
        path = parsed.path.lower()
        full_url = url.lower()
    except:
        domain = ''
        path = ''
        full_url = url.lower()

    # 1. URL total length
    features.append(len(url))

    # 2. Domain length
    features.append(len(domain))

    # 3. Path length
    features.append(len(path))

    # 4. Number of dots in URL
    features.append(full_url.count('.'))

    # 5. Number of hyphens in domain only
    features.append(domain.count('-'))

    # 6. Number of underscores
    features.append(full_url.count('_'))

    # 7. Number of slashes
    features.append(full_url.count('/'))

    # 8. Number of digits in URL
    features.append(sum(c.isdigit() for c in full_url))

    # 9. Number of special characters
    features.append(len(re.findall(r'[@!#$%^&*()<>?|}{~:]', full_url)))

    # 10. Has @ symbol (very common in phishing)
    features.append(1 if '@' in full_url else 0)

    # 11. Has IP address as domain
    features.append(1 if re.match(r'\d+\.\d+\.\d+\.\d+', domain) else 0)

    # 12. Uses HTTPS
    features.append(1 if url.startswith('https') else 0)

    # 13. Number of subdomains
    parts = domain.split('.')
    features.append(max(0, len(parts) - 2))

    # 14. Has suspicious keywords in domain
    suspicious_domain = ['login', 'verify', 'secure', 'account', 'update',
                         'banking', 'confirm', 'password', 'signin', 'paypal',
                         'ebay', 'amazon', 'apple', 'microsoft', 'support',
                         'service', 'online', 'web', 'auth', 'validate']
    features.append(sum(1 for w in suspicious_domain if w in domain))

    # 15. Has double slash in path
    features.append(1 if '//' in path else 0)

    # 16. Has port in URL
    features.append(1 if re.search(r':\d+', domain) else 0)

    # 17. Number of query parameters
    features.append(full_url.count('='))

    # 18. Domain contains numbers
    features.append(1 if re.search(r'\d', domain) else 0)

    # 19. Suspicious TLD
    bad_tlds = ['.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz',
                '.top', '.click', '.link', '.work', '.party', '.loan']
    features.append(1 if any(domain.endswith(t) for t in bad_tlds) else 0)

    # 20. URL length > 75
    features.append(1 if len(url) > 75 else 0)

    # 21. Has encoded characters
    features.append(1 if '%' in full_url else 0)

    # 22. Has multiple hyphens (phishing trick)
    features.append(1 if domain.count('-') > 2 else 0)

    # 23. Domain is very long (> 30 chars)
    features.append(1 if len(domain) > 30 else 0)

    # 24. Has brand name in subdomain but different root
    brands = ['paypal', 'amazon', 'google', 'apple', 'microsoft',
              'facebook', 'netflix', 'ebay', 'instagram', 'twitter']
    has_brand_in_subdomain = 0
    if len(parts) > 2:
        subdomain = '.'.join(parts[:-2])
        root = parts[-2] if len(parts) >= 2 else ''
        if any(brand in subdomain for brand in brands) and root not in brands:
            has_brand_in_subdomain = 1
    features.append(has_brand_in_subdomain)

    # 25. Ratio of digits to URL length
    digit_ratio = sum(c.isdigit() for c in full_url) / max(len(full_url), 1)
    features.append(round(digit_ratio, 4))

    return features


FEATURE_NAMES = [
    'url_length', 'domain_length', 'path_length', 'dot_count',
    'hyphen_count', 'underscore_count', 'slash_count', 'digit_count',
    'special_char_count', 'has_at', 'has_ip', 'has_https',
    'subdomain_count', 'suspicious_keyword_count', 'has_double_slash',
    'has_port', 'query_param_count', 'domain_has_numbers', 'bad_tld',
    'very_long_url', 'has_encoded_chars', 'multiple_hyphens',
    'long_domain', 'brand_in_subdomain', 'digit_ratio'
]