# MineCatalog

**MineCatalog** is an automatically updated comprehensive registry of Minecraft items, blocks, and their properties. The database is refreshed daily through automated web scraping to ensure it always contains the most current information.

## Features

- **Complete Item Database**: All Minecraft items with their IDs, display names, and properties
- **Daily Updates**: Automatically scrapes the latest data every 24 hours
- **Base64 Images**: Item icons included as Base64 strings in the JSON
- **Easy Integration**: Use the raw JSON file directly in your projects
- **MIT Licensed**: Free to use in personal and commercial projects

## Data Structure

The database is stored as a single JSON file with the following structure:

```json
{
  "metadata": {
    "lastUpdated": "2025-03-30T12:34:56.789Z",
    "totalItems": 1024,
    "source": "https://mcutils.com/item-ids"
  },
  "items": [
    {
      "displayName": "Stone",
      "itemId": "stone",
      "damageValue": "1",
      "stackSize": "64",
      "imgAlt": "Stone Icon",
      "imgSrc": "data:image/png;base64,..."
    },
    // More items...
  ]
}
```

## Usage

### Direct JSON Access

You can access the raw JSON file directly through GitHub:

```
https://raw.githubusercontent.com/JHVIW/MineCatalog/main/minecraft-items.json
```

### JavaScript Example

```javascript
fetch('https://raw.githubusercontent.com/JHVIW/MineCatalog/main/minecraft-items.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.items.length} Minecraft items`);
    // Do something with the data
  });
```

### Python Example

```python
import requests
import json

response = requests.get('https://raw.githubusercontent.com/JHVIW/MineCatalog/main/minecraft-items.json')
data = response.json()

print(f"Last updated: {data['metadata']['lastUpdated']}")
print(f"Total items: {data['metadata']['totalItems']}")

# Get all stone variants
stone_items = [item for item in data['items'] if 'stone' in item['itemId']]
print(f"Found {len(stone_items)} stone variants")
```

## Setup Your Own Instance

If you want to run your own instance of MineCatalog:

1. Fork this repository
2. Go to repository Settings > Actions > General > Workflow permissions
3. Select "Read and write permissions" and save
4. Trigger a manual workflow run from the Actions tab or wait for the scheduled run

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Item data sourced from [MCUtils.com](https://mcutils.com/item-ids)
- Built with GitHub Actions for automated updates
