# Production concept vs. public demo

This repository is an independently rewritten portfolio version of an internal integration idea.

## Production concept

The original application was designed to:

1. run in the requester information area of a service ticket;
2. obtain the requester's email through the Freshworks app client;
3. authenticate against an external asset-management system through platform request templates;
4. cache a short-lived token;
5. search external asset records by email;
6. verify that the requester matched the current employee assignment;
7. map internal asset fields to ID, serial number and warranty date;
8. link support agents to the corresponding source record.

## Public demo

The public version keeps the ticket-context logic, data transformation, filtering, states and almost identical widget styling. It replaces the external API with a local synthetic repository.

This means the repository contains no production credentials, tenant details, internal field IDs, group IDs, API paths, employee data or proprietary source code.
