"use client";
import { useState, useCallback } from 'react';

/**
 * Generic undo/redo history hook
 * Provides state management with history tracking
 */
export function useHistory<T>(initialState: T) {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [index, setIndex] = useState(0);

    const current = history[index];

    const canUndo = index > 0;
    const canRedo = index < history.length - 1;

    const push = useCallback((newState: T) => {
        setHistory(prev => {
            // Remove any future states after current index
            const newHistory = prev.slice(0, index + 1);
            newHistory.push(newState);
            return newHistory;
        });
        setIndex(prev => prev + 1);
    }, [index]);

    const undo = useCallback(() => {
        if (canUndo) {
            setIndex(prev => prev - 1);
        }
    }, [canUndo]);

    const redo = useCallback(() => {
        if (canRedo) {
            setIndex(prev => prev + 1);
        }
    }, [canRedo]);

    const reset = useCallback((newState: T) => {
        setHistory([newState]);
        setIndex(0);
    }, []);

    const setCurrent = useCallback((newState: T) => {
        // Update current state without adding to history
        // Useful for intermediate states during drag operations
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[index] = newState;
            return newHistory;
        });
    }, [index]);

    return {
        current,
        canUndo,
        canRedo,
        push,
        undo,
        redo,
        reset,
        setCurrent,
        historyLength: history.length,
        currentIndex: index,
    };
}

export default useHistory;
