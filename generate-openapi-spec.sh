#!/bin/bash

# OpenAPI Spec Generation Script
# Fetches the OpenAPI specification from public endpoints (no authentication required)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="http://localhost:8086"
OUTPUT_FILE="openapi-spec.json"
SWAGGER_OUTPUT_FILE="swagger-ui.html"

echo -e "${BLUE}🔧 OpenAPI Specification Generator${NC}"
echo "================================================"
echo "Date: $(date)"
echo "================================================"

# Function to make API calls with better error handling
api_call() {
    local method="$1"
    local endpoint="$2"
    local description="$3"
    
    echo -e "\n${YELLOW}Testing: ${description}${NC}"
    echo "  → ${method} ${API_BASE}${endpoint}"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X "$method" "${API_BASE}${endpoint}")
    
    # Extract HTTP status code from last line
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [[ "$HTTP_CODE" -ge 200 && "$HTTP_CODE" -lt 300 ]]; then
        echo -e "  ${GREEN}✅ SUCCESS (${HTTP_CODE})${NC}"
        if [[ ${#BODY} -gt 200 ]]; then
            echo -e "  📄 Response: ${BODY:0:200}..."
        else
            echo -e "  📄 Response: $BODY"
        fi
        return 0
    else
        echo -e "  ${RED}❌ FAILED (${HTTP_CODE})${NC}"
        echo -e "  📄 Error: $BODY"
        return 1
    fi
}

echo -e "\n${BLUE}🔍 Checking Services${NC}"
echo "================================================"

# Check if API is responding
if curl -s "${API_BASE}/public/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API is responding${NC}"
else
    echo -e "${RED}❌ API is not responding at ${API_BASE}${NC}"
    exit 1
fi

echo -e "\n${BLUE}📋 Fetching OpenAPI Specification${NC}"
echo "================================================"

# Common OpenAPI endpoints to try (all are now public)
declare -a OPENAPI_ENDPOINTS=(
    "/v3/api-docs"
    "/v3/api-docs.yaml"
    "/api-docs"
    "/openapi.json"
)

SPEC_FOUND=false

# Try each endpoint
for endpoint in "${OPENAPI_ENDPOINTS[@]}"; do
    echo -e "\n${YELLOW}Trying endpoint: ${endpoint}${NC}"
    
    if api_call "GET" "$endpoint" "OpenAPI Spec (Public)"; then
        # Check if response looks like OpenAPI spec
        if echo "$BODY" | grep -q -E '(openapi|swagger|"info"|"paths")'; then
            echo -e "${GREEN}🎉 Found OpenAPI specification at: ${endpoint}${NC}"
            echo "$BODY" > "$OUTPUT_FILE"
            echo -e "${GREEN}📄 Saved OpenAPI spec to: ${OUTPUT_FILE}${NC}"
            
            # Pretty print if jq is available
            if command -v jq >/dev/null 2>&1; then
                echo -e "${BLUE}📊 OpenAPI Spec Summary:${NC}"
                echo "$BODY" | jq -r '
                    "  OpenAPI Version: " + (.openapi // "N/A") + "\n" +
                    "  Title: " + (.info.title // "N/A") + "\n" +
                    "  Version: " + (.info.version // "N/A") + "\n" +
                    "  Description: " + (.info.description // "N/A") + "\n" +
                    "  Paths: " + ((.paths // {}) | keys | length | tostring) + " endpoints\n" +
                    "  Components: " + ((.components.schemas // {}) | keys | length | tostring) + " schemas"
                ' 2>/dev/null || echo "  (Could not parse spec summary)"
            fi
            
            SPEC_FOUND=true
            break
        fi
    fi
done

# Try to fetch Swagger UI page as well
echo -e "\n${BLUE}🌐 Fetching Swagger UI${NC}"
echo "================================================"

SWAGGER_ENDPOINTS=("/swagger-ui/index.html" "/swagger-ui.html")

for endpoint in "${SWAGGER_ENDPOINTS[@]}"; do
    echo -e "\n${YELLOW}Trying Swagger UI endpoint: ${endpoint}${NC}"
    
    if api_call "GET" "$endpoint" "Swagger UI Page"; then
        if echo "$BODY" | grep -q -E '(swagger|<!DOCTYPE|<html)'; then
            echo -e "${GREEN}🎉 Found Swagger UI at: ${endpoint}${NC}"
            echo "$BODY" > "$SWAGGER_OUTPUT_FILE"
            echo -e "${GREEN}📄 Saved Swagger UI to: ${SWAGGER_OUTPUT_FILE}${NC}"
            break
        fi
    fi
done

echo -e "\n${BLUE}📊 Generation Summary${NC}"
echo "================================================"

if $SPEC_FOUND; then
    echo -e "${GREEN}✅ OpenAPI specification successfully generated!${NC}"
    echo -e "  📄 Spec file: ${OUTPUT_FILE}"
    
    if [ -f "$OUTPUT_FILE" ]; then
        FILE_SIZE=$(wc -c < "$OUTPUT_FILE" | tr -d ' ')
        echo -e "  📦 File size: ${FILE_SIZE} bytes"
        
        # Show first few lines of the spec
        echo -e "\n${BLUE}📋 Preview of OpenAPI spec:${NC}"
        head -10 "$OUTPUT_FILE" | sed 's/^/  /'
    fi
    
    if [ -f "$SWAGGER_OUTPUT_FILE" ]; then
        echo -e "  🌐 Swagger UI: ${SWAGGER_OUTPUT_FILE}"
    fi
    
    echo -e "\n${GREEN}🔍 Next steps:${NC}"
    echo -e "  • View the spec: cat ${OUTPUT_FILE}"
    echo -e "  • Pretty print: cat ${OUTPUT_FILE} | jq ."
    echo -e "  • Validate: curl -X POST -H 'Content-Type: application/json' -d @${OUTPUT_FILE} https://validator.swagger.io/validator/debug"
    echo -e "  • Generate TypeScript client: npm run generate:api-client"
    echo -e "  • Access Swagger UI: Open http://localhost:8086/swagger-ui/index.html in browser"
    
else
    echo -e "${RED}❌ Failed to find OpenAPI specification${NC}"
    echo -e "${YELLOW}💡 Possible issues:${NC}"
    echo -e "  • API server may not be running (check: docker compose ps)"
    echo -e "  • OpenAPI endpoints may be disabled in Spring configuration"
    echo -e "  • SpringDoc OpenAPI may not be properly configured"
    echo -e "  • Check application.properties for springdoc settings"
    
    exit 1
fi

echo -e "\n${GREEN}🎉 OpenAPI spec generation completed successfully!${NC}"
echo "================================================"
