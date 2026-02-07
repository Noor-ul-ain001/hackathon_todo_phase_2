---
id: 1
title: Agentic Todo Constitution v1.0.0
stage: constitution
date: 2025-12-23
surface: agent
model: claude-sonnet-4-5
feature: none
branch: 001-physical-ai-platform
user: Noor-ul-ain001
command: /sp.constitution
labels: ["constitution", "project-setup", "governance", "phase-model", "spec-driven-development"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - history/prompts/constitution/1-agentic-todo-constitution-v1.constitution.prompt.md
tests:
 - None (constitution document)
---

## Prompt

1. Project Identity

Project Name:
Agentic Todo Application

Objective:
Design and implement a Todo application using spec-driven development and the Agentic Dev Stack, progressing from a minimal MVP to an intelligent task management system using Claude Code and Spec-Kit Plus, with reusable agent intelligence.

2. Development Philosophy (Global Rules)

This constitution applies once and governs all phases.

Non-Negotiable Rules

Specification First – No code without an approved spec

One Constitution – This document is written once and reused

Phase-Bound Enforcement – Only features allowed by the active phase may be implemented

No Manual Coding – Claude Code writes all code

Agentic Workflow Only – Human reviews, agents execute

3. Phase Model (Critical)

The project is divided into three cumulative phases.

Phase    Name    Scope
Phase I    Core Essentials    CRUD Todo (Easy)
Phase II    Organization & Usability    Productivity features
Phase III    Intelligent Features    Smart automation

⚠️ A phase may only implement features explicitly allowed for that phase.

4. Feature Specification (All Levels)
4.1 Phase I – Basic Level (Core Essentials)

Mandatory Features

Add Task

Delete Task

Update Task

View Task List

Mark Task Complete / Incomplete

Task Fields

ID (auto-increment)

Title (required)

Description (optional)

Completed (boolean)

Storage

In-memory only

Interface

Command-line interface (CLI)

4.2 Phase II – Intermediate Level (Organization & Usability)

Enhancements to Task Model

Priority: low | medium | high

Tags / Categories: list of strings

New Features

Search tasks by keyword

Filter tasks by:

status

priority

tag

Sort tasks by:

due date (if present)

priority

alphabetical order

Persistence

Optional (file-based or memory) — must be specified before use

4.3 Phase III – Advanced Level (Intelligent Features)

Advanced Task Capabilities

Due dates (date + time)

Recurring tasks (daily / weekly / custom interval)

Intelligent Behavior

Auto-generation of next task occurrence

Reminder scheduling logic

Notification triggers (CLI or system)

Constraints

All intelligence must be deterministic

No external AI APIs unless explicitly specified in a spec

5. Unified Data Model (Extensible)
Task
- id: int
- title: str
- description: str
- completed: bool
- priority: Optional[str]
- tags: Optional[list[str]]
- due_date: Optional[datetime]
- recurring_rule: Optional[str]


⚠️ Fields may only be activated in the phase that introduces them.

6. Architecture Principles (Global)

Applies to all phases:

Modular architecture

Separation of concerns

Phase-safe extensibility

Clean Python design

Explicit state management

Human-readable CLI output

7. Mandatory Project Structure
.
├── CLAUDE.md
├── README.md
├── sp.constitution.md
├── specs/
│   ├── phase1/
│   ├── phase2/
│   └── phase3/
├── src/
│   ├── main.py
│   ├── models/
│   ├── services/
│   ├── ui/
│   └── utils/
└── pyproject.toml

8. Agentic Dev Stack Workflow (Enforced Globally)

Claude Code must always follow:

/sp.specify

/sp.plan

/sp.tasks

/sp.implement

/sp.review

No step may be skipped or merged.

9. Reusable Intelligence (Core Requirement)
9.1 Subagents (Reusable Across Phases)

spec_writer

planner_agent

task_designer

python_implementer

quality_reviewer

These agents must be reused, not recreated.

9.2 Agent Skills (Persistent)

spec_driven_development

cli_app_design

clean_python_architecture

incremental_feature_extension

state_management

time_based_logic

10. Technology Stack (Global)

Python 3.13+

UV environment manager

Claude Code

Spec-Kit Plus

Console-based execution

11. Documentation Requirements
README.md

Phase overview

Setup instructions

How to run each phase

Example commands

CLAUDE.md

Agent workflow rules

Prohibited actions

Phase enforcement instructions

12. Evaluation & Review Criteria

Judging will be based on:

Correct phase isolation

Spec quality and traceability

Clean extensible architecture

[User input truncated for brevity - full constitution details provided]

## Response snapshot

Created comprehensive Agentic Todo Application Constitution v1.0.0 with the following structure:

**9 Core Principles (3 NON-NEGOTIABLE)**:
1. Specification First - No code without approved spec
2. Phase-Bound Enforcement - Only phase-allowed features
3. Agentic Workflow Only - Claude Code writes all code
4. Modular Architecture - Clear separation of concerns
5. Clean Python Design - Type-safe, PEP 8 compliant
6. Test-Driven Development - RED-GREEN-REFACTOR cycle
7. Incremental Delivery - Working checkpoints per phase
8. Reusable Intelligence - Agent and skill reuse
9. Documentation Standards - Complete, accurate docs

**Phase Model**:
- Phase I: Core CRUD (in-memory, CLI)
- Phase II: Organization features (priority, tags, filtering)
- Phase III: Intelligence (recurring tasks, reminders)

**Data Model**: Extensible Task dataclass with phase-gated field activation

**Technology Stack**: Python 3.13+, UV, Claude Code, Spec-Kit Plus, pytest

**Governance**: Semantic versioning, amendment process, compliance review

File created at: `.specify/memory/constitution.md`

Constitution enforces:
- Mandatory workflow: specify → plan → tasks → implement → review
- Reusable subagents: spec_writer, planner_agent, task_designer, python_implementer, quality_reviewer
- PHR creation for all user interactions
- ADR suggestions for architectural decisions

## Outcome

- ✅ Impact: Established foundational governance for entire Agentic Todo Application project across all three phases
- 🧪 Tests: None (governance document, not code)
- 📁 Files: 1 created (.specify/memory/constitution.md), 1 PHR record created
- 🔁 Next prompts: `/sp.specify` to create Phase I specification, README.md creation, project structure setup
- 🧠 Reflection: Constitution provides clear boundaries for phased development with enforceable rules. Three non-negotiable principles (spec-first, phase-bound, agentic-only) prevent common pitfalls. Reusable intelligence framework ensures compound learning across phases.

## Evaluation notes (flywheel)

- Failure modes observed: None - initial constitution creation
- Graders run and results (PASS/FAIL): PASS - All placeholders resolved, version set to 1.0.0, semantic structure complete
- Prompt variant (if applicable): constitution-v1-phased-todo-app
- Next experiment (smallest change to try): Create Phase I specification using /sp.specify to validate spec-first principle enforcement
