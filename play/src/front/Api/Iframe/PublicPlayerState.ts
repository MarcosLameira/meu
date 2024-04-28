/**
 * PublicPlayerState is the part of the state of a player that is shared with other players.
 * The interface is empty. It is meant to be extended by the ScriptingAPI developers to add custom properties.
 */
export interface PublicPlayerState {
    [key: string]: unknown
}
