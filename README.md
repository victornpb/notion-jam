![](./notion-jam-logo-256.png)

# notion-jam
<!-- badge -->
[![GitHub Action: View on Marketplace](https://img.shields.io/badge/GitHub%20Action-View_on_Marketplace-blue?style=flat-square&logo=github)](https://github.com/marketplace/actions/notion-jam)
[![Version](https://img.shields.io/npm/v/notion-jam.svg?style=flat-square)](https://www.npmjs.com/package/notion-jam)
[![Downloads](https://img.shields.io/npm/dt/notion-jam.svg?style=flat-square)](https://www.npmjs.com/package/notion-jam)
[![CodeFactor](https://www.codefactor.io/repository/github/victornpb/notion-jam/badge?style=flat-square)](https://www.codefactor.io/repository/github/victornpb/notion-jam)
[![Node](https://img.shields.io/node/v/notion-jam.svg?style=flat-square)](package.json)
[![LICENSE](https://img.shields.io/github/license/victornpb/notion-jam?style=flat-square)](LICENSE)
<!-- endbadge -->

**Sync pages from Notion to GitHub to be used as a static website ([JAM][jamstack])**

---

## Usage

### Quick Start

1. Create a new Notion Integration
    
    ![notion secret.gif](Notion%20JAM%209e299002311840b7ae0bb3fb714990f2/notion_secret.gif)
    
2. Add Notion secret to GitHub repository
    1. Go to `github.com/{user}/{repo}/settings/secrets/actions`
    2. Set `NOTION_SECRET` of Notion to your repository secret.
        
        [Encrypted secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets#using-encrypted-secrets-in-a-workflow)
        
    
    ![add notion secret to github.gif](Notion%20JAM%209e299002311840b7ae0bb3fb714990f2/add_notion_secret_to_github.gif)
    
3. Share the Database with the integration
    
    ![add perm.gif](Notion%20JAM%209e299002311840b7ae0bb3fb714990f2/add_perm.gif)
    
4. Create a workflow in `.github/workflows/**.yml` of your repository
    
    ### Example Workflow
    
    ```yaml
    # This is a basic workflow to help you get started with Actions
    
    name: NotionJAM
    
    # Controls when the workflow will run
    on:
      schedule:
        - cron: "0 21 * * *" # daily
      push:
        branches: [master, main]
    
      # Allows you to run this workflow manually from the Actions tab
      workflow_dispatch:
    
    # A workflow run is made up of one or more jobs that can run sequentially or in parallel
    jobs:
      # This workflow contains a single job called "build"
      build:
        # The type of runner that the job will run on
        runs-on: ubuntu-latest
    
        # Steps represent a sequence of tasks that will be executed as part of the job
        steps:
          # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
          - uses: actions/checkout@v3
    
          - name: notion-jam
            uses: victornpb/notion-jam@v0.0.10
            with:
              NOTION_SECRET: ${{ secrets.NOTION_SECRET }}
              NOTION_DATABASE: https://www.notion.so/9e34cee9f5bd4c4aaf0d2eaf73ead47b
              FILTER_PROP: Status
              FILTER_VALUES: Published
              CONVERT_PROP_CASE: snake
              ARTICLE_PATH: content/posts/{title}/README.md
              ASSETS_PATH: ./
              PARALLEL_PAGES: 25
              PARALLEL_DOWNLOADS_PER_PAGE: 3
              DOWNLOAD_IMAGE_TIMEOUT: 30
              SKIP_DOWNLOADED_IMAGES: true
              DOWNLOAD_FRONTMATTER_IMAGES: true
          
          - name: Save changes
            uses: stefanzweifel/git-auto-commit-action@v4
            with:
              commit_message: Commit changes
    ```
    

## Configuration

### Parameters

| Name | Description | Required | Default |
| --- | --- | --- | --- |
| NOTION_SECRET | Notion API Token secret | ✅ |  |
| NOTION_DATABASE | Notion Database URL or ID (example: https://notion.so/00112233445566778899aabbccddeeff) | ✅ |  |
| FILTER_PROP |  |  | Status |
| FILTER_VALUES |  |  | Published |
| CONVERT_PROP_CASE |  |  | snake |
| ARTICLE_PATH | Path template to where to save markdown files |  | posts/{title}/README.md |
| ASSETS_PATH | Path to save images, if started with . will be relative to ARTICLE_PATH, otherwise absolute |  | ./ |
| PARALLEL_PAGES |  |  | 25 |
| PARALLEL_DOWNLOADS_PER_PAGE |  |  | 3 |
| DOWNLOAD_IMAGE_TIMEOUT |  |  | 30 |
| SKIP_DOWNLOADED_IMAGES | Skip downloading images if they already exist in the path |  | true |
| DOWNLOAD_FRONTMATTER_IMAGES | Downloads image urls in the frontmatter |  | true |


  [jamstack]: https://jamstack.org/what-is-jamstack/