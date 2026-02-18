# Use Case Diagram

This document outlines the interactions between the system and its primary actors: Candidate, Interviewer, and System.

```mermaid
usecaseDiagram
    actor "Candidate" as C
    actor "Interviewer" as I
    actor "System" as S

    package "Full Stack Interview Platform" {
        usecase "Sign In (Clerk)" as UC1
        usecase "Join Interview Room" as UC2
        usecase "Live Coding" as UC3
        usecase "Execute Code Remotely" as UC4
        usecase "View Test Results" as UC5
        usecase "Video/Audio Call" as UC6
        usecase "In-Room Chat" as UC7
        usecase "Record Session" as UC8
        usecase "View Dashboard Stats" as UC9
        usecase "Manage Room" as UC10
    }

    %% Authentication
    C --> UC1
    I --> UC1

    %% Interview Process
    C --> UC2
    I --> UC2
    I --> UC10

    %% Collaboration & Coding
    C --> UC3
    I --> UC3
    C --> UC4
    I --> UC4
    
    %% Communication
    C --> UC6
    I --> UC6
    C --> UC7
    I --> UC7

    %% System Responses
    UC4 ..> S : "Validates & Executes"
    S --> UC5 : "Returns Output"
    C --> UC5
    I --> UC5

    %% Post-Interview / Stats
    I --> UC8
    C --> UC9
    I --> UC9
    
    %% Relationships
    UC2 ..> UC1 : <<include>>
    UC4 ..> UC3 : <<extend>>
```
