#!/bin/bash
# Seed 50 SSD drives into the SIMS inventory via the backend API
API="http://localhost:5001/api/inventory"

MODELS=(
  "Samsung 990 Pro"
  "Samsung 970 EVO Plus"
  "Samsung 870 EVO"
  "WD Black SN850X"
  "WD Blue SA510"
  "Crucial MX500"
  "Crucial P5 Plus"
  "Seagate FireCuda 530"
  "Kingston KC3000"
  "Kingston A400"
  "SK Hynix Platinum P41"
  "Intel Optane 905P"
)

CAPACITIES=("250 GB" "500 GB" "1 TB" "2 TB" "4 TB" "8 TB")

INTERFACES=("SATA III" "NVMe PCIe 3.0" "NVMe PCIe 4.0" "NVMe PCIe 5.0")

STATUSES=("Active" "Available" "Failed")

LOCATIONS=(
  "Rack A, Bay 1"
  "Rack A, Bay 2"
  "Rack A, Bay 3"
  "Rack B, Bay 1"
  "Rack B, Bay 2"
  "Rack B, Bay 3"
  "Server Room 1"
  "Server Room 2"
  "Warehouse"
  "Data Center East"
  "Data Center West"
)

# Generate a random serial number like S71DNU0W123456K
gen_serial() {
  local chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  local serial="S"
  for i in {1..14}; do
    serial+="${chars:$((RANDOM % 36)):1}"
  done
  echo "$serial"
}

echo "Seeding 50 SSD drives..."
echo "========================="

success=0
fail=0

for i in $(seq -w 1 50); do
  MODEL="${MODELS[$((RANDOM % ${#MODELS[@]}))]}"
  CAPACITY="${CAPACITIES[$((RANDOM % ${#CAPACITIES[@]}))]}"
  INTERFACE="${INTERFACES[$((RANDOM % ${#INTERFACES[@]}))]}"

  # Weight statuses: ~65% Active, ~25% Available, ~10% Failed
  R=$((RANDOM % 100))
  if [ $R -lt 65 ]; then
    STATUS="Active"
  elif [ $R -lt 90 ]; then
    STATUS="Available"
  else
    STATUS="Failed"
  fi

  LOCATION="${LOCATIONS[$((RANDOM % ${#LOCATIONS[@]}))]}"
  SERIAL=$(gen_serial)

  # Build JSON payload with jq if available, otherwise manual
  JSON=$(cat <<EOF
{
  "deviceId": "SSD-${i}",
  "model": "${MODEL}",
  "serialNumber": "${SERIAL}",
  "capacity": "${CAPACITY}",
  "interface": "${INTERFACE}",
  "status": "${STATUS}",
  "location": "${LOCATION}"
}
EOF
)

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$API" \
    -H "Content-Type: application/json" \
    -d "$JSON")

  if [ "$HTTP_CODE" = "201" ]; then
    echo "✓ SSD-${i} | ${MODEL} | ${CAPACITY} | ${STATUS} | ${LOCATION}"
    ((success++))
  else
    echo "✗ SSD-${i} FAILED (HTTP ${HTTP_CODE})"
    ((fail++))
  fi
done

echo "========================="
echo "Done: ${success} created, ${fail} failed"
