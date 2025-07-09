# .github/workflows/schedule.yml
name: Scheduled Trigger

on:
  schedule:
    - cron: '*/1 * * * *'  # Varje minut
  workflow_dispatch:       # Så du kan testa manuellt också

jobs:
  trigger-supabase:
    runs-on: ubuntu-latest
    steps:
      - name: Call Supabase Edge Function
        run: |
          curl -X POST https://pybwervwbgamjgbmimjs.supabase.co/functions/v1/smooth-processor \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            --data '{"name":"Functions"}'
