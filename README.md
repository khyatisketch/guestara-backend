## Guestara – Menu & Services Management Backend
This project is a backend system designed to manage menus, services, pricing, availability, bookings, and add-ons for a real-world restaurant / booking / SaaS-style product.

The goal of this assignment was not to build simple CRUD APIs, but to model realistic business behavior such as tax inheritance, dynamic pricing, availability-based bookings, and conflict prevention, while keeping the codebase clean and explainable.

## Tech Stack
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod-style validation (logic-level)
- REST APIs
- Modular service-based architecture

## High-Level Architecture
The project follows a modular, service-oriented structure:
```
src/
  modules/
    category/
    subcategory/
    item/
    addons/
    booking/
  core/
    errors/
    utils/
  config/
```
### Design Principles
- Separation of concerns
   - Controllers handle HTTP
   - Services handle business logic
   - Models handle persistence
- No business logic in controllers
- No derived data stored in DB
- Soft deletes instead of hard deletes

This structure makes the system easier to reason about, extend, and explain.

## Core Domain Model
### Category
- Top-level grouping (e.g., Beverages, Rooms)
- Owns default tax rules
- Soft deletable (is_active = false)
### Subcategory
- Belongs to a category
- Can override tax rules or inherit from category
### Item
- Belongs to either a category or a subcategory (never both)
- Owns pricing configuration
- Optional availability and booking support
- Optional tax override
### Add-ons
- Belong to an item
- Affect final price
- Support optional grouping (e.g., choose one sauce)
### Booking
- Represents a reserved time slot for an item
- Prevents overlapping reservations

## Tax Inheritance Design (Critical Requirement)
Tax is not denormalized into items.

### Resolution Order
1. Item tax (if defined)
2. Subcategory tax (if defined)
3. Category tax (fallback)
### Why this approach?
- Changing a category’s tax automatically affects all inheriting items
- No manual updates required
- Prevents data inconsistency
### Implementation
Tax is resolved at price-calculation time, not stored.

This keeps the data model clean and flexible.

## Pricing Engine

Each item supports exactly one pricing type.

### Supported Pricing Types
1. Static

Fixed price.
```
Cappuccino → ₹200
```
2. Tiered

Price depends on duration.
```
Up to 1 hour → ₹300
Up to 2 hours → ₹500
```
Rules:
- Tiers must not overlap
- Correct tier is selected dynamically
3. Complimentary

Always free.
```
Welcome Drink → ₹0
```
Rules:
- Price always resolves to 0
- Cannot accept base price
4. Discounted

Base price with discount.
- Flat discount or percentage discount
- Final price never negative
5. Dynamic (Time-based)
  
Price changes by time window.
```
8:00–11:00 → ₹199
After 11:00 → unavailable
```
Rules:
- Overlapping windows not allowed
- Availability enforced at request time

## Pricing Endpoint (Required)
```
GET /items/:id/price
```
### Response Includes
- Applied pricing rule
- Base price
- Discount
- Add-ons
- Tax (resolved via inheritance)
- Final payable amount

This endpoint forces real business logic, not static DB reads.
## Availability & Booking System

Items can optionally be bookable.
### Availability Definition
- Available days (Mon–Sun)
- Time slots (e.g., 10:00–11:00)
### Booking Rules
- Slot must be within availability
- Already booked slots cannot be booked again
- Overlapping time conflicts are prevented
### Conflict Detection

Two bookings conflict if:
```
start1 < end2 AND start2 < end1
```

Availability is computed dynamically by subtracting booked slots.
## Add-ons System
- Add-ons belong to an item
- Can be optional or mandatory
- Affect final payable price
- Supports grouping (e.g., choose 1 of N)

Add-ons are resolved during price calculation, not stored in totals.
## Search, Filtering & Pagination
### Supported
- Partial text search
- Filters: category, subcategory, active
- Price range filtering
- Sorting by name, price, or creation time
- Pagination with page & limit
### Important Trade-off

Prices are dynamically computed (tiered, time-based, discounted).

Because of this:
- Price filtering & sorting is done in memory
- Prices are resolved via the pricing engine before filtering
```
In a production system, this would be optimized using caching or materialized views.
For this assignment, correctness and clarity were prioritized.
```

## Soft Deletes

No records are physically deleted.
- `is_active = false` used everywhere
- Inactive categories automatically hide subcategories & items at read-time
- Prevents accidental data loss
## Error Handling
- Centralized error middleware
- Consistent error responses
- Business rule violations return clear messages
## Why MongoDB?

I chose MongoDB because:
- Pricing rules and availability windows are naturally nested
- Flexible schemas simplify dynamic pricing structures
- Reduced join complexity for this use case
## Challenges Faced

Pricing resolution combined with tax inheritance and add-ons was the hardest part.

I solved this by:
- Centralizing all pricing logic in a single service
- Resolving tax dynamically instead of storing it
- Treating pricing as a computation, not a stored value

This made the system easier to reason about and extend.
## What I Would Improve With More Time
- Introduce caching for price resolution
- Add transactional safety for booking (race conditions)
- Normalize error codes
- Add automated tests for pricing and booking logic
## How to Run Locally
```
npm install
npm run dev
```

Health check:
```
GET /health
```
## Loom Walkthrough

The Loom video covers:
- Schema design & relationships
- Pricing engine logic
- Tax inheritance approach
- Booking conflict handling
- One key challenge and how it was solved

## Final Notes

This project prioritizes:
- Correct business logic
- Clean structure
- Explainable design decisions

 The implementation intentionally favors engineering clarity over feature bloat.
