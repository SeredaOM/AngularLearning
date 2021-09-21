import { HttpClientModule } from '@angular/common/http';
import { DebugElement, Injectable } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { MatButtonHarness } from '@angular/material/button/testing';
import { MatRadioGroupHarness, MatRadioButtonHarness } from '@angular/material/radio/testing';
import { MatRadioButton, MatRadioGroup, MatRadioModule } from '@angular/material/radio';

import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MockComponent, MockInstance, ngMocks } from 'ng-mocks';

import { HexComponent } from '../hex/hex.component';
import { HexesService } from '../hex/hexes.service';
import { IMapDescription } from '../Models/MapDescription';
import { MapsComponent } from './maps.component';

let loader: HarnessLoader;

@Injectable()
class MockHexesService extends HexesService {
  public getMapDataAvailableForPlayer() {
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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MapsComponent, MockComponent(HexComponent)],
        imports: [MatRadioModule, HttpClientModule],
        providers: [HexesService],
      }).compileComponents();

      MockInstance(HexComponent, 'loadMap', jasmine.createSpy());

      TestBed.overrideComponent(MapsComponent, {
        set: {
          providers: [{ provide: HexesService, useClass: MockHexesService }],
        },
      });

      fixture = TestBed.createComponent(MapsComponent);
      component = fixture.componentInstance;
      componentService = fixture.debugElement.injector.get(HexesService);
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'Loaded map descriptions should load names and set state for "Edit" buttons',
    waitForAsync(async () => {
      const tblRows = fixture.debugElement.nativeElement.querySelectorAll('table tr');

      const cells0 = tblRows[0].querySelectorAll('td');
      expect(cells0[0].innerHTML).toBe('Map 1');
      expect(cells0[1].innerHTML).toBe('Nick 1');

      const cells1 = tblRows[1].querySelectorAll('td');
      expect(cells1[0].innerHTML).toBe('Map 2');
      expect(cells1[1].innerHTML).toBe('Nick 2');

      const btns0 = tblRows[0].querySelectorAll('button');
      expect(btns0.length).toBe(2);
      expect(btns0[0].innerHTML).toBe('View Map');

      const btns1 = tblRows[1].querySelectorAll('button');
      expect(btns1.length).toBe(2);
      expect(btns1[0].innerHTML).toBe('View Map');

      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      expect(buttons.length).toBe(4);
      expect(await buttons[0].getText()).toBe('View Map');
      expect(await buttons[1].getText()).toBe('Start Game');

      const groups = await loader.getAllHarnesses(MatRadioGroupHarness);
      expect(groups.length).toBe(1);
      const group = groups[0];
      expect(await group.getCheckedValue()).toBe(null);

      const radios = await group.getRadioButtons();
      expect(radios.length).toBe(2);
      const radioEnabled = radios[0];
      expect(await radioEnabled.isDisabled()).toBeFalse();
      expect(await radioEnabled.getValue()).toBe('1');

      const radioDisabled = radios[1];
      expect(await radioDisabled.isDisabled()).toBeTrue();
      expect(await radioDisabled.getValue()).toBe('2');
    })
  );

  it(
    'Click on "View" button should load the map',
    waitForAsync(() => {
      const hexComponent = ngMocks.findInstance(HexComponent);
      expect(hexComponent).toBeDefined();
      expect(hexComponent.loadMap).not.toHaveBeenCalled();

      const btns = fixture.debugElement.nativeElement.querySelectorAll('button');
      expect(btns.length).toBe(4);
      const btnView = btns[0];
      expect(btnView.innerHTML).toBe('View Map');

      btnView.click();

      fixture.whenStable().then(() => {
        expect(hexComponent.loadMap).toHaveBeenCalledWith(1, true);
      });
    })
  );

  it(
    'Click on the 1st "Edit" button should load the map in edit mode',
    waitForAsync(async () => {
      const hexComponent = ngMocks.findInstance(HexComponent);
      expect(hexComponent).toBeDefined();
      expect(hexComponent.loadMap).not.toHaveBeenCalled();

      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      expect(buttons.length).toBe(4);

      const button2 = buttons[2];
      expect(await button2.getText()).toBe('View Map');

      const groups = await loader.getAllHarnesses(MatRadioGroupHarness);
      expect(groups.length).toBe(1);
      const group = groups[0];
      expect(await group.getCheckedValue()).toBe(null);

      const radios = await group.getRadioButtons();
      expect(radios.length).toBe(2);
      const radioEnabled = radios[0];

      await radioEnabled.check();

      fixture.whenStable().then(() => {
        expect(hexComponent.loadMap).toHaveBeenCalledWith(1, false);
      });
    })
  );
});
