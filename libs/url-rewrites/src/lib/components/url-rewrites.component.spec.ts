import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlRewritesComponent } from './url-rewrites.component';
import { Meta } from '@angular/platform-browser';
import { UrlRewritesService } from '../services/url-rewrites.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';

describe('UrlRewritesComponent', () => {
  let component: UrlRewritesComponent;
  let fixture: ComponentFixture<UrlRewritesComponent>;
  let urlRewritesService: UrlRewritesService;
  let messageService: MessageService;
  let metaService: Meta;

  beforeEach(async () => {
    const urlRewritesServiceMock = {
      generateRewrites: vi.fn().mockReturnValue(of('mock rewrite rule')),
    };

    const messageServiceMock = {
      add: vi.fn(),
    };

    const metaServiceMock = {
      updateTag: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UrlRewritesComponent, ReactiveFormsModule],
      providers: [
        { provide: UrlRewritesService, useValue: urlRewritesServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: Meta, useValue: metaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlRewritesComponent);
    component = fixture.componentInstance;
    urlRewritesService = TestBed.inject(UrlRewritesService);
    messageService = TestBed.inject(MessageService);
    metaService = TestBed.inject(Meta);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with one URL row', () => {
    expect(component.signalFormGroup().urlRows.length).toBe(1);
  });

  it('should update meta tag on init', () => {
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: expect.any(String),
    });
  });

  describe('Form Array Management', () => {
    it('should add new URL row', () => {
      const initialLength = component.signalFormGroup().urlRows.length;
      component.addUrlRowSignal();
      expect(component.signalFormGroup().urlRows.length).toBe(initialLength + 1);
    });

    it('should remove URL row', () => {
      component.addUrlRowSignal(); // Add an extra row first
      const initialLength = component.signalFormGroup().urlRows.length;
      component.removeUrlRowSignal(1);
      expect(component.signalFormGroup().urlRows.length).toBe(initialLength - 1);
    });

    it('should not remove last row when only one exists', () => {
      expect(component.hasOnlyOneSignalRow()).toBe(true);
      component.removeUrlRowSignal(0);
      expect(component.signalFormGroup().urlRows.length).toBe(1);
    });
  });

  describe('Form Submission', () => {
    it('should generate rewrites on submit', () => {
      component.signalFormGroup.update(() => ({
        urlRows: [
          {
            oldUrl: 'https://example.com/old',
            newUrl: 'https://example.com/new',
          },
        ],
      }));

      component.onSubmit();

      expect(urlRewritesService.generateRewrites).toHaveBeenCalled();
      expect(component.result()).toBe('mock rewrite rule');
    });
  });

  describe('Copy Functionality', () => {
    beforeEach(() => {
      component.result.set('test rewrite rule');
    });

    it('should handle successful copy', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        configurable: true,
      });

      component.copyRewrites();

      // wait for observable pipeline to resolve
      await Promise.resolve();
      await Promise.resolve();

      expect(messageService.add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
    });

    it('should handle copy failure', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockRejectedValue(new Error('Copy failed')) },
        configurable: true,
      });

      component.copyRewrites();

      // wait for observable pipeline to resolve
      await Promise.resolve();
      await Promise.resolve();

      expect(messageService.add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
    });
  });
});
