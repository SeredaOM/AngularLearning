import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HexesService } from '../hex/hexes.service';
import { IMapDescription } from '../ServiceData/MapDescription';

import { MapsComponent } from './maps.component';

class MockHexesService extends HexesService {
  public getMapDataAvailableForPlayer(playerId: number) {
    let md1: IMapDescription = {
      mapId: 1,
      mapName: 'Map 1',
      ownerId: 1,
      ownerNick: 'Nick 1',
      published: false,
    };
    let md2: IMapDescription = {
      mapId: 2,
      mapName: 'Map 2',
      ownerId: 2,
      ownerNick: 'Nick 2',
      published: true,
    };
    let mds: IMapDescription[] = [md1, md2];

    return of(mds);
  }
}

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;
  let componentService: HexesService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [MapsComponent],
      providers: [HexesService],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideComponent(MapsComponent, {
      set: {
        providers: [{ provide: HexesService, useClass: MockHexesService }],
      },
    });

    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    componentService = fixture.debugElement.injector.get(HexesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Loaded map descriptions should load names and set state for "Edit" buttons', () => {
    // componentService
    //   .getMapDataAvailableForPlayer(1)
    //   .subscribe((mds: IMapDescription[]) => {
    //     expect(mds[0].mapName).toEqual('Map 1');
    //   });

    const tblRows =
      fixture.debugElement.nativeElement.querySelectorAll('table tr');

    const cells0 = tblRows[0].querySelectorAll('td');
    expect(cells0[0].innerHTML).toBe('Map 1');
    expect(cells0[1].innerHTML).toBe('Nick 1');

    const cells1 = tblRows[1].querySelectorAll('td');
    expect(cells1[0].innerHTML).toBe('Map 2');
    expect(cells1[1].innerHTML).toBe('Nick 2');

    const btns0 = tblRows[0].querySelectorAll('button');
    expect(btns0.length).toBe(3);
    expect(btns0[0].innerHTML).toBe('View Map');
    expect(btns0[1].innerHTML).toBe('Edit Map');
    expect(btns0[1].disabled).toBeFalse();

    const btns1 = tblRows[1].querySelectorAll('button');
    expect(btns1.length).toBe(3);
    expect(btns1[0].innerHTML).toBe('View Map');
    expect(btns1[1].innerHTML).toBe('Edit Map');
    expect(btns1[1].disabled).toBeTrue();
  });
});
