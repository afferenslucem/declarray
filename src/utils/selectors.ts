export function fakeSelector<TInner, TOuter>(item: TInner): TOuter {
    return item as unknown as TOuter;
}
