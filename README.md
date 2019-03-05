# Kitty Diary

A website diary for our two wonderful cats, Ezio and Icarus.

Hosted at: https://kitties.mkv25.net/

## Aspirations

- Display a feed of cat related events
- Display diary entries from google sheets
- Display cat photos from google photos
- Display feeding information on a weekly basis
- Display weight information on a monthly basis

## Development

### Setup

This project requires `node >= 10 LTS`.

1. Use `git clone` to check out this repository to your local machine.

* From the project folder, run `npm install` to install dependencies.

* From the project folder, run `node run` to see a list of commands.

* In a separate tab, run `node server` to start a local web server.

## Updating Data Sets

Use `node run` to see a list of available commands.

### Download Feeding Diary

Downloads all and the latest feeding diary data from google sheets.

- `node run download-feeding-diary`
- Creates `data/feeding-diary.json`

## Build Website

After downloading data, you can build the site as static HTML.

- `node run build-website`
- Creates files in the temporary directory `build/` based on templates and data

## Deployment

After building, and assuming you have set up a secret password file as [per the instructions](./deploy/README.md), then simply run:
- `node deploy live-release`

And all the files in the `build` directory will be uploaded to the server.
