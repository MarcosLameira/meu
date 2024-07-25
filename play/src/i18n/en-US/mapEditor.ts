import type { BaseTranslation } from "../i18n-types";

const mapEditor: BaseTranslation = {
    map: {
        refreshPrompt: "New version of map detected. Refresh needed",
    },
    sideBar: {
        areaEditor: "Area editor tool",
        entityEditor: "Entity editor tool",
        tileEditor: "Tile editor tool",
        configureMyRoom: "Configure my room",
        trashEditor: "Trash",
        exploreTheRoom: "Explore the room",
        closeMapEditor: "Close map editor",
        mapManagerActivated: "Map manager activated",
        mapExplorerActivated: "Map overview",
        exploreTheRoomActivated: "Explore the room activated",
        areaEditorActivated: "Area editor activated",
        entityEditorActivated: "Entity editor activated",
        trashEditorActivated: "Trash editor activated",
        configureMyRoomActivated: "Configure my room activated",
    },
    properties: {
        silentProperty: {
            label: "Silent",
            description: "Do not allow for conversations inside.",
        },
        textProperties: {
            label: "Header Text",
            placeholder: "Input here text which will be displayed when interacting with the object",
        },
        focusableProperties: {
            label: "Focusable",
            description: "Focus camera on this area on enter.",
            zoomMarginLabel: "Zoom Margin",
            defaultButtonLabel: "Focus on",
        },
        jitsiProperties: {
            label: "Jitsi Room",
            description: "Start Jitsi meeting on enter.",
            roomNameLabel: "Room Name",
            jitsiUrl: "Jitsi URL",
            jitsiUrlPlaceholder: "meet.jit.si",
            roomNamePlaceholder: "Room Name",
            defaultButtonLabel: "Open Jitsi Room",
            audioMutedLabel: "Muted by default",
            moreOptionsLabel: "More Options",
            trigger: "Open trigger",
            triggerMessage: "Toast Message",
            triggerShowImmediately: "Show immediately on enter",
            triggerOnClick: "Start as minimized in bottom bar",
            triggerOnAction: "Show action toast with message",
            closable: "Can be closed",
            noPrefix: "Share with other rooms",
            width: "Width",
            jitsiRoomConfig: {
                addConfig: "Add an option",
                startWithAudioMuted: "Start with microphone muted",
                startWithVideoMuted: "Start with video closed",
                jitsiRoomAdminTag: "Moderator tag for the meeting room",
                cancel: "Cancel",
                validate: "Validate",
            },
        },
        audioProperties: {
            label: "Play Audio File",
            description: "Play audio with adjustable volume.",
            volumeLabel: "Volume",
            audioLinkLabel: "Audio Link",
            audioLinkPlaceholder: "https://xxx.yyy/smthing.mp3",
            defaultButtonLabel: "Play music",
            error: "Could not load sound",
        },
        linkProperties: {
            label: "Open Link",
            description: "Open website within WorkAdventure or as a new tab.",
            linkLabel: "Link URL",
            newTabLabel: "Open in new tab",
            trigger: "Interaction",
            triggerMessage: "Toast Message",
            triggerShowImmediately: "Show immediately on enter",
            triggerOnClick: "Start as minimized in bottom bar",
            triggerOnAction: "Show action toast with message",
            closable: "Can be closed",
            allowAPI: "Allow Scripting API",
            linkPlaceholder: "https://example.com",
            defaultButtonLabel: "Open Link",
            width: "Width",
            policy: "iFrame Allow",
            policyPlaceholder: "fullscreen",
            errorEmbeddableLink: "The link is not embeddable",
            messageNotEmbeddableLink: "The link is not embeddable. It can only open in a new tab",
            warningEmbeddableLink: "This link cannot be embedded.",
            errorInvalidUrl: 'Please enter a valid URL (starting with "https://")',
            findOutMoreHere: "Find out more here",
            openPickerSelector: "Open picker selector",
            forcedInNewTab: "Forced in new tab",
        },
        advancedOptions: "Advanced Options",
        speakerMegaphoneProperties: {
            label: "Speaker zone",
            description: "",
            nameLabel: "Name",
            namePlaceholder: "MySpeakerZone",
        },
        listenerMegaphoneProperties: {
            label: "Attendees zone",
            description: "",
            nameLabel: "SpeakerZone Name",
            namePlaceholder: "MySpeakerZone",
        },
        chatEnabled: "Associate a dedicated chat channel",
        startProperties: {
            label: "Start area",
            description: "Where people can start in the map.",
            nameLabel: "Start name",
            namePlaceholder: "Enter1",
            type: "Start position type",
            defaultMenuItem: "Use by default",
            hashMenuItem: "Use if URL contains #[area name]",
        },
        exitProperties: {
            label: "Exit area",
            description: "Where people can exit the map to another one.",
            exitMap: "Exit map",
            exitMapStartAreaName: "Start area name",
            defaultStartArea: "Default start area",
        },
        youtubeProperties: {
            label: "Open Youtube Video",
            description: "Open Youtube video within WorkAdventure or as a new tab.",
            error: "Please enter a valid Youtube URL",
            disabled: "Youtube integration is disabled.",
        },
        googleDocsProperties: {
            label: "Open Google Docs",
            description: "Open Google Docs within WorkAdventure or as a new tab.",
            error: "Please enter a valid Google Docs URL",
            disabled: "Google Docs integration is disabled.",
        },
        klaxoonProperties: {
            label: "Open Klaxoon",
            description: "Open Klaxoon within WorkAdventure or as a new tab.",
            error: "Please enter a valid Klaxoon URL",
            disabled: "Klaxoon integration is disabled.",
        },
        googleSheetsProperties: {
            label: "Open Google Sheets",
            description: "Open Google Sheets within WorkAdventure or as a new tab.",
            error: "Please enter a valid Google Sheets URL",
            disabled: "Google Sheets integration is disabled.",
        },
        googleSlidesProperties: {
            label: "Open Google Slides",
            description: "Open Google Slides within WorkAdventure or as a new tab.",
            error: "Please enter a valid Google Slides URL",
            disabled: "Google Slides integration is disabled.",
        },
        eraserProperties: {
            label: "Eraser",
            description: "Erase all drawings on the map.",
            defaultButtonLabel: "Erase",
            error: "Please enter a valid Eraser URL",
            disabled: "Eraser integration is disabled.",
        },
        googleDriveProperties: {
            label: "Open Google Drive",
            description: "Open Google Drive within WorkAdventure or as a new tab.",
            error: "Please enter a valid Google Drive URL",
            disabled: "Google Drive integration is disabled.",
        },
        restrictedRightsProperties: {
            label: "Add rights",
            rightTitle: "Access / edition rights by user tag",
            rightDescription:
                "Rights define who can interact with the area. If you leave it empty, everyone can use it. If you set it, only users who have at least one of these 'tags' can use it.",
            rightWriteTitle: "Edition rights",
            rightWriteDescription:
                "Edition rights define who can modify the area. Users matching one of these tags can create, update or delete an object in the area.",
            rightReadTitle: "Access rights",
            rightReadDescription:
                "Access rights define who can interact with the area. Users matching one of these tags can enter the area and use objects whithin the area.",
        },
        personalAreaConfiguration: {
            label: "Personal area",
            description:
                "Users can claim personal areas as their own space. As an administrator, you can set/revoke ownership of an area",
            accessClaimMode: "Access claim mode",
            dynamicAccessClaimMode: "Dynamic",
            staticAccessClaimMode: "Static",
            dynamicAccessDescription: "Anyone with appropriate user tags can claim the property of the zone.",
            staticAccessDescription: "Manually define the owner of the zone.",
            allowedTags: "Allowed user tags",
            allowedUser: "Allowed user",
            owner: "Owner",
            revokeAccess: "Revoke access",
        },
        excalidrawProperties: {
            label: "Open Excalidraw",
            description: "An open source virtual hand-drawn style whiteboard. Collaborative and end-to-end encrypted.",
            error: "Please enter a valid Excalidraw URL",
            disabled: "Excalidraw integration is disabled.",
        },
        cardsProperties: {
            label: "Open Cards",
            description:
                "Quickest and easyestsolution to share your knowledge in no time, online, on MS Teams and on mobile.",
            error: "Please enter a valid Cards URL",
            disabled: "Cards integration is disabled.",
        },
        matrixProperties: {
            label: "link Matrix room",
            description: "link Matrix room to your area",
            openAutomaticallyChatLabel: "Automatically open chat",
            localRoomLabel: "Select a local room",
            remoteRoomLabel: "Select a remote room",
            createARoom: "Create a new room",
        },
    },
    areaEditor: {
        editInstructions: "Click an area to modify its properties.",
        nameLabel: "Name",
        nameLabelPlaceholder: "MyArea",
        areaDescription: "Description",
        areaDescriptionPlaceholder: "My area is a...",
        areaSerchable: "Searchable in the exploration mode",
        addDescriptionField: "Add description field",
        actionPopupOnPersonalAreaWithEntities: {
            title: "Action required",
            description: "This personal area contains one or more objects. What would you like to do with it/them ?",
            buttons: {
                keep: "Keep",
                remove: "Remove",
                cancel: "Cancel",
            },
        },
    },
    areaEditorInstructions: {
        title: "How it works ?",
        description: "Draw a zone on the map to create a new one.",
    },
    entityEditor: {
        header: {
            title: "Add object to your map",
            description: "Search, upload or select existing object and add it in the map.",
        },
        title: "Put your object",
        editing: "Editing: {name}",
        itemPicker: {
            searchPlaceholder: "Search",
            backToSelectObject: "Back to select object",
        },
        trashTool: {
            delete: "Click on the object to delete it!",
        },
        deleteButton: "Delete",
        testInteractionButton: "Test Interaction",
        buttonLabel: "Button Label",
        editInstructions: "Click an entity to modify its properties.",
        selectObject: "Click on an object to select it",
        objectName: "Object Name",
        objectNamePlaceholder: "MyObject",
        objectDescription: "Object Description",
        objectDescriptionPlaceholder: "My object is a...",
        objectSearchable: "Searchable in the exploration mode",
        addDescriptionField: "Add description field",
        uploadEntity: {
            title: "Add your image",
            description: "Drag and drop or choose your image to add it in the map",
            dragDrop: "Drag and Drop or",
            chooseFile: "Choose file",
            errorOnFileFormat: "File format not supported",
            errorOnFileNumber: "Multiple file drop is not supported",
        },
        images: "Image{{s}}",
        noImage: "No image",
        customEntityEditorForm: {
            imageName: "Image name",
            tags: "Tags",
            writeTag: "Write tag...",
            objectType: "Object type",
            floatingObject: "Floating object",
            floatingObjectDescription:
                "A floating object can be placed freely on the map. Otherwise, it will be aligned on the map grid.",
            depth: "Depth",
            groundLevel: "Ground level",
            custom: "Custom",
            standing: "Standing",
            collision: "Collision",
            wokaAbove: "Woka above",
            wokaBelow: "Woka below",
        },
        buttons: {
            editEntity: "Edit",
            back: "Back",
            cancel: "Cancel",
            delete: "Delete",
            save: "Save",
            upload: "Upload",
        },
    },
    settings: {
        loading: "Loading",
        megaphone: {
            title: "Megaphone",
            description:
                "The megaphone is a tool that allows you to broadcast a video/audio stream to all players in the room/world.",
            inputs: {
                spaceName: "Space name",
                spaceNameHelper:
                    "If you want to broadcast a stream to all the users that are on different rooms but in the same world, you must set the same SpaceName for all the megaphone settings in each room and set the scope to 'World'.",
                scope: "Scope",
                world: "World",
                room: "Room",
                rights: "Rights",
                rightsHelper:
                    "The rights define who can use the megaphone. If you leave it empty, anyone can use it. If you set it, only users that have one of those 'tag' can use it.",
                error: {
                    title: "Please enter a title",
                    save: {
                        success: "Megaphone settings saved",
                        fail: "Error while saving megaphone settings",
                    },
                },
            },
        },
        room: {
            title: "Room Settings",
            description: "Configure your room",
            inputs: {
                name: "Room name",
                description: "Room description",
                tags: "Tags",
                copyright: "Room license",
                thumbnail: "Room thumbnail",
            },
            helps: {
                description: "A description of the map. Can be used in social networks when sharing a link to the map.",
                tags: "A list of tags. Can be used to grant access to the map.",
                thumbnail:
                    "URL to a thumbnail image. This image will be used in social networks when sharing a link to the map.",
                copyright:
                    "Copyright notice for this map. Can be a link to a license. Parts of this map like tilesets or images can have their own copyright.",
            },
            actions: {
                save: "Save",
                confirm: "Confirm",
                success: "Room settings saved",
                error: "Error while saving room settings",
            },
            confirmSave:
                "Confirm that you want to save the changes to the map. This will create a new version of the map, disconnect all players and reload the map for all players.",
        },
    },
    explorer: {
        title: "Explore the room",
        description:
            "Allow to explore the room. You be able to move around the room and interact with objects. 2 mode are available: 'Exploration' and 'Search'. The 'Search mode' mode will propose you to search or filter entities and areas in the room. The 'Exploration mode' mode will let you move freely in the room.",
        noEntitiesFound: "No entity found in the room 🙅‍♂️",
        entitiesFound: "object{{s}} found",
        noAreasFound: "No area found in the room 🙅‍♀️",
        areasFound: "area{{s}} found",
        noDescriptionFound: "No description found 🫥",
        details: {
            close: "Close",
            moveToEntity: "Move to entity {name}",
            moveToArea: "Move to area {name}",
            errorMovingToObject: "The object is not accessible yet 🚫",
        },
    },
    listRoom: {
        isFetching: "Room list is fetching... ⤵️",
        noRoomFound: "No room found 🙅‍♂️",
        items: "{countEntity} entities / {countArea} areas",
        close: "Close",
        movingToRoom: "Moving to the room: {roomNameSelected}... See you soon... 🫡",
        searchLabel: "Search a room",
        searchPlaceholder: "Write...",
    },
};

export default mapEditor;
